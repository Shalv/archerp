/**
 * Build Storys ERP - Design, Drawings & AI Design Options Studio (Pillars 4 & 5)
 * Multi-disciplinary drawing repository with CAD / 3D revision control,
 * GFC issuance, client sign-offs, customer discovery studio, 64-head sample visual generator,
 * professional visual information pack, and 5 AI design concepts with client action buttons.
 */

import React, { useState, useEffect } from 'react';
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
  Share2,
  ThumbsUp,
  Edit3,
  XCircle,
  Bookmark,
  Calendar,
  X,
  Printer,
  Upload,
  UserCheck
} from 'lucide-react';
import { ProjectRecord, UserSession, AIDesignOption } from '../types/erp';
import {
  CustomerDiscoveryData,
  CategorySampleHead,
  INITIAL_CUSTOMER_DISCOVERY,
  INITIAL_CATEGORY_SAMPLE_HEADS
} from '../data/discoveryAndSampleHeadsData';
import { CustomerDiscoveryFormView } from './discovery/CustomerDiscoveryFormView';
import { CategoryVisualSampleHeadsView } from './discovery/CategoryVisualSampleHeadsView';
import { VisualInformationPackView } from './discovery/VisualInformationPackView';

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
    title: 'Overall Architectural Floor Plan & Room Demarcation Layout',
    revision: 'Rev C',
    status: 'GFC_ISSUED',
    sheetSize: 'A1',
    scale: '1:100',
    author: 'Ar. Aniket Joshi',
    checker: 'Ar. Sanjay Puri (Principal)',
    releaseDate: '2026-03-02',
    fileSizeMb: 14.2,
    imageThumbnail: '/assets/images/cad_floor_plan_1789216705163.jpg',
    gfcStampDate: '2026-03-03',
    clientCommentsCount: 2
  },
  {
    id: 'DWG-002',
    drawingCode: 'SKY-INT-L-105',
    discipline: 'INTERIOR_LAYOUT',
    title: 'Living & Dining Forum - Joinery & Millwork Working Details',
    revision: 'Rev B',
    status: 'CLIENT_APPROVED',
    sheetSize: 'A1',
    scale: '1:50',
    author: 'Meera Rao (Lead Interior)',
    checker: 'Project Lead',
    releaseDate: '2026-02-28',
    fileSizeMb: 19.4,
    imageThumbnail: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    clientCommentsCount: 3
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

// 5 Complete AI Design Concepts (Modern Luxury, Neo-Classical, Premium Industrial, Tropical Eco, Traditional Indian)
const INITIAL_AI_OPTIONS: AIDesignOption[] = [
  {
    id: 'AI-OPT-01',
    projectId: 'PROJ-SKYLINE-1402',
    optionCode: 'OPTION-1',
    optionName: 'Modern Luxury Biophilic with Italian Marble & Warm Teak',
    architecturalStyle: 'Contemporary Biophilic Luxury',
    lifestyleProfile: 'C-Suite Executive Family, Entertaining Guests, Pet Friendly',
    layoutConcept: 'Open-plan continuous living-dining volume with full-height pocket sliding fluted glass dividers to study and unobstructed sea vista.',
    spacePlanningSuggestions: [
      'Eliminate 4.5" dining-study wall to expand natural light penetration from seaface balcony',
      'Create 8-seater island breakfast counter integrated into gourmet dry kitchen',
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
    pros: ['Highest luxury resale and appraisal value', 'Superior acoustic isolation in bedrooms', 'Maximized natural daylight penetration'],
    cons: ['Requires 7-day marble crystallization lead time', 'Higher upfront investment'],
    internalApprovalStatus: 'CLIENT_SELECTED',
    approvedByEstimatorOrLead: 'Ar. Sanjay Puri (Principal)',
    approvedDate: '2026-03-01',
    internalReviewNotes: 'Fully vetted by estimation team. All rates aligned with master library.',
    renderImageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    layoutImageUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
    suggestedPalette: ['#F5F2EB', '#C5A059', '#3D3D3D', '#5C715E', '#A89F91'],
    flooringRecommendation: 'Imported Botticino Classico Italian Marble with diamond mirror polish',
    wallTreatment: 'Acoustic Smoked Teak Veneer Wall Slats with warm indirect 2700K cove light',
    furnitureStyle: 'Curved Italian Leather Sectional Sofas with Brushed Champagne Brass Trims',
    lightingStyle: 'DALI-2 Magnetic Architectural Track Lighting 3000K & Hidden Perimeter Coves',
    materialSuggestion: 'Dekton Porcelain Slab, Brushed Champagne Brass, Natural Smoked Teak Veneer',
    clientActionStatus: 'LIKED'
  },
  {
    id: 'AI-OPT-02',
    projectId: 'PROJ-SKYLINE-1402',
    optionCode: 'OPTION-2',
    optionName: 'Neo-Classical Haussmann Elegance with Brass Trims & Oak Parquet',
    architecturalStyle: 'Modern Parisian Haussmann / Neo-Classical',
    lifestyleProfile: 'Art Collectors, Formal Dinners, Sophisticated Classical Taste',
    layoutConcept: 'Symmetrical room enfilade with decorative wall mouldings, coffered acoustic ceilings, and herringbone parquet flooring.',
    spacePlanningSuggestions: [
      'Add arched vestibule transition between public living room and private bedrooms',
      'Dual vanity in master bathroom with backlit fluted marble pilasters',
      'Grand formal dining gallery with ornate ceiling rose and crystal pendant chandelier'
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
    pros: ['Timeless architectural character and regal aesthetic', 'Intricate craftsmanship on wall paneling and architraves'],
    cons: ['Longer joinery fabrication schedule', 'Delicate wooden floor maintenance'],
    internalApprovalStatus: 'INTERNAL_APPROVED',
    approvedByEstimatorOrLead: 'Estimator R. Sen',
    approvedDate: '2026-02-28',
    internalReviewNotes: 'Approved as premium alternative for customer comparison.',
    renderImageUrl: '/assets/images/neoclassic_render_1789216684796.jpg',
    layoutImageUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
    suggestedPalette: ['#FAF7F2', '#B8977E', '#D4AF37', '#2B3A42', '#7A6B5D'],
    flooringRecommendation: 'Engineered European White Oak Herringbone Parquet with border inlays',
    wallTreatment: 'High-density PU wall mouldings with Stucco Veneziano Italian plaster',
    furnitureStyle: 'Plush velvet tufted armchairs with sculpted walnut framing',
    lightingStyle: 'Layered classical warm wall sconces, brass chandeliers, and picture lights',
    materialSuggestion: 'European White Oak, Stucco Plaster, Antique Brass, Fluted Calacatta Marble',
    clientActionStatus: 'SHORTLISTED'
  },
  {
    id: 'AI-OPT-03',
    projectId: 'PROJ-SKYLINE-1402',
    optionCode: 'OPTION-3',
    optionName: 'Premium Industrial Minimalist Loft with Microtopping & Matte Black Metals',
    architecturalStyle: 'Urban Industrial Loft / Japandi Fusion',
    lifestyleProfile: 'Tech Founders, Minimalist Living, Clean Lines, Low Maintenance',
    layoutConcept: 'Seamless micro-concrete continuous floor with exposed ceiling slab treated in acoustic acoustic plaster and blackened steel elements.',
    spacePlanningSuggestions: [
      'Full open kitchen with concrete waterfall island and overhead hanging steel gantry rack',
      'Slide-away metal acoustic glass partitions separating lounge and executive study'
    ],
    materialRecommendations: [
      { trade: 'Flooring', specification: 'Seamless Microtopping Concrete 3mm by Ideal Work Italy', brandTier: 'Ideal Work', durabilityRating: 'High Abrasion Resistant' },
      { trade: 'Metalwork', specification: 'CNC laser-cut mild steel with ultra-matte architectural powder coat', brandTier: 'AkzoNobel Interpon', durabilityRating: 'Class 2' }
    ],
    sustainabilityFeatures: [
      'Minimal demolition debris by applying microtopping directly over screed',
      'Low embodied energy raw materials and zero VOC sealers'
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
    pros: ['Fastest execution timeline (16 weeks)', 'Cost effective (saves ~25% over marble options)', 'Scratch and water resilient'],
    cons: ['Subjective industrial aesthetic', 'Cooler acoustic profile without rugs'],
    internalApprovalStatus: 'INTERNAL_APPROVED',
    approvedByEstimatorOrLead: 'Estimator R. Sen',
    approvedDate: '2026-02-28',
    renderImageUrl: '/assets/images/industrial_concept_render_1789216663974.jpg',
    layoutImageUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
    suggestedPalette: ['#E6E6E6', '#222222', '#8C7B6D', '#B0A8A0', '#4A5568'],
    flooringRecommendation: 'Seamless Microtopping Concrete 3mm in Warm Pebble Grey',
    wallTreatment: 'Exposed treated concrete panels with acoustic felt baffles and matte black metal reveals',
    furnitureStyle: 'Low-slung modular linen sofa with raw steel and live-edge walnut slab table',
    lightingStyle: 'Industrial magnetic track spots with warm wire-suspended linear LED tubes',
    materialSuggestion: 'Microtopping, Blackened Steel, Tinted Fluted Glass, Reclaimed Elm Wood',
    clientActionStatus: 'NONE'
  },
  {
    id: 'AI-OPT-04',
    projectId: 'PROJ-SKYLINE-1402',
    optionCode: 'OPTION-4',
    optionName: 'Sustainable Tropical Eco-Villa Fitout with Natural Rattan & Lime Plaster',
    architecturalStyle: 'Biophilic Tropical Sustainable',
    lifestyleProfile: 'Wellness focused, Eco-conscious, Organic Living, Multi-generational',
    layoutConcept: 'Indoor courtyards, natural ventilation wind tunnels, living green walls with automated drip irrigation, and shaded terrace verandas.',
    spacePlanningSuggestions: [
      'Balcony integrated planter boxes with automated drip lines and outdoor shower',
      'Timber louvers for solar shading on south-facing glass'
    ],
    materialRecommendations: [
      { trade: 'Flooring', specification: 'Handcrafted Kota Stone & Terracotta Tiles with brass inlays', brandTier: 'Heritage Natural Stone', durabilityRating: 'Centuries' },
      { trade: 'Cabinetry', specification: 'Reclaimed Teak wood with natural woven cane rattan inserts', brandTier: 'Artisanal Handcraft', durabilityRating: 'High' }
    ],
    sustainabilityFeatures: [
      '100% locally sourced carbon-negative building materials within 200km radius',
      'Integrated indoor air purification plants with HEPA air exchange'
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
    pros: ['Eco-friendly and carbon-neutral', 'High thermal insulation reducing AC electricity bills', 'Serene resort-like sanctuary'],
    cons: ['Artisanal cane requires skilled craftsmen with longer lead times'],
    internalApprovalStatus: 'INTERNAL_APPROVED',
    approvedByEstimatorOrLead: 'Ar. Sanjay Puri',
    approvedDate: '2026-03-01',
    renderImageUrl: '/assets/images/tropical_eco_render_1789218073135.jpg',
    layoutImageUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
    suggestedPalette: ['#EFECE6', '#7D8471', '#C29B7F', '#5E4B3E', '#A3B19B'],
    flooringRecommendation: 'Leather-finish Kota stone with brass divider trims and terracotta tiles',
    wallTreatment: 'Breathable mineral lime plaster with natural clay wall wash',
    furnitureStyle: 'Handcrafted solid teak with woven cane rattan weaves and pure organic linen',
    lightingStyle: 'Woven bamboo pendants with 2700K diffused warm indirect illumination',
    materialSuggestion: 'Kota Stone, Terracotta, Reclaimed Teak, Woven Rattan, Breathable Lime Plaster',
    clientActionStatus: 'NONE'
  },
  {
    id: 'AI-OPT-05',
    projectId: 'PROJ-SKYLINE-1402',
    optionCode: 'OPTION-5',
    optionName: 'Traditional Indian Contemporary Heritage with Makrana Marble & Teak Jaali',
    architecturalStyle: 'Indian Ethnic / Warm Contemporary',
    lifestyleProfile: 'Joint Family, Cultural Patrons, Vastu-Compliant Living',
    layoutConcept: 'Central Brahmastanam courtyard circulation with carved Makrana marble sanctum, brass fretwork jaali screens, and fluted teak wall paneling.',
    spacePlanningSuggestions: [
      'North-East dedicated Ishan prayer pooja mandir with backlit white Makrana marble',
      'South-West master sanctuary with brass inlaid timber flooring and antique bronze hardware',
      'Central living area with traditional low-slung seating and courtyard skylight feature'
    ],
    materialRecommendations: [
      { trade: 'Flooring', specification: 'Hand-selected White Makrana Marble with Inlaid Jaisalmer Yellow & Brass Trims', brandTier: 'Heritage Rajasthan Quarry', durabilityRating: 'Centuries' },
      { trade: 'Joinery', specification: 'Solid CP Teakwood with Handcrafted CNC Jaali Screens and Natural Beeswax Finish', brandTier: 'Artisanal Heritage', durabilityRating: 'Generational' },
      { trade: 'Hardware', specification: 'Hand-forged Solid Brass Pulls, Studs and Mortise Locks', brandTier: 'Bespoke Traditional', durabilityRating: 'PVD Coated Anti-Tarnish' },
      { trade: 'Lighting', specification: 'Concealed 2700K Warm LED Strips with Handcrafted Brass Filigree Pendant Lamps', brandTier: 'Artisanal Lighting', durabilityRating: '50,000 hrs' }
    ],
    sustainabilityFeatures: [
      'Locally sourced indigenous natural stones with low transportation carbon footprint',
      'Natural passive cooling through perforated jaali air-pressure differentials'
    ],
    preliminaryBOQSummary: {
      civilDemolition: 440000,
      flooringMarble: 2650000,
      carpentryMillwork: 3950000,
      electricalAutomation: 1280000,
      paintingFinishes: 690000,
      hvacPlumbing: 940000
    },
    budgetRangeMin: 9800000,
    budgetRangeMax: 11200000,
    estimatedTimelineWeeks: 21,
    pros: ['100% Vastu compliance across all zones', 'Generational bespoke artisanal Indian craft', 'Natural thermal cooling'],
    cons: ['Handcrafted jaali requires skilled master craftsmen lead time'],
    internalApprovalStatus: 'INTERNAL_APPROVED',
    approvedByEstimatorOrLead: 'Ar. Sanjay Puri',
    approvedDate: '2026-03-02',
    renderImageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
    layoutImageUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
    suggestedPalette: ['#F7F3E9', '#D4AF37', '#8C4329', '#2E473B', '#5A3E2A'],
    flooringRecommendation: 'White Makrana Marble with Jaisalmer Gold inlays',
    wallTreatment: 'Zero-VOC mineral lime plaster with fluted teakwood jaali partitions',
    furnitureStyle: 'Solid teakwood contemporary seating with pure raw silk and brass trims',
    lightingStyle: 'Warm 2700K indirect ambient cove with filigree brass drop pendants',
    materialSuggestion: 'Makrana Marble, Solid CP Teak, Hand-forged Brass, Handwoven Raw Silk',
    clientActionStatus: 'NONE'
  }
];

export const DesignAndDrawingsManagementView: React.FC<DesignAndDrawingsManagementViewProps> = ({
  project,
  currentUser,
  onNavigateTab
}) => {
  // Navigation Sub-Tabs
  const [activeSubTab, setActiveSubTab] = useState<'discovery' | 'heads' | 'info_pack' | 'ai_options' | 'drawings' | 'comparison'>('discovery');

  // Customer Discovery Data State (with local persistence)
  const [discoveryData, setDiscoveryData] = useState<CustomerDiscoveryData>(() => {
    const saved = localStorage.getItem(`discovery_data_${project.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved discovery data:', e);
      }
    }
    return INITIAL_CUSTOMER_DISCOVERY;
  });

  // Category Sample Heads State (with local persistence)
  const [sampleHeads, setSampleHeads] = useState<CategorySampleHead[]>(() => {
    const saved = localStorage.getItem(`sample_heads_${project.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved sample heads:', e);
      }
    }
    return INITIAL_CATEGORY_SAMPLE_HEADS;
  });

  // Drawings and AI Options State (with local persistence)
  const [drawings, setDrawings] = useState<DrawingRecord[]>(INITIAL_DRAWINGS);
  const [aiOptions, setAiOptions] = useState<AIDesignOption[]>(() => {
    const saved = localStorage.getItem(`ai_options_${project.id}`);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.warn('Failed to parse saved AI options:', e);
      }
    }
    return INITIAL_AI_OPTIONS;
  });

  const [selectedOption, setSelectedOption] = useState<AIDesignOption>(aiOptions[0]);
  const [disciplineFilter, setDisciplineFilter] = useState<string>('ALL');

  // Interactive Action Modals
  const [modifyingOption, setModifyingOption] = useState<AIDesignOption | null>(null);
  const [modificationNotes, setModificationNotes] = useState('');
  const [schedulingOption, setSchedulingOption] = useState<AIDesignOption | null>(null);
  const [discussionDate, setDiscussionDate] = useState('2026-03-20');
  const [discussionTime, setDiscussionTime] = useState('11:00 AM');
  const [discussionAgenda, setDiscussionAgenda] = useState('Review layout revisions and approve preliminary BOQ');
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastText(text);
    setTimeout(() => setToastText(null), 3500);
  };

  // Persist discovery data
  const handleSaveDiscoveryData = (updated: CustomerDiscoveryData) => {
    setDiscoveryData(updated);
    localStorage.setItem(`discovery_data_${project.id}`, JSON.stringify(updated));
  };

  // Update sample head image (AI regen or manual upload)
  const handleUpdateSampleHead = (headId: string, updatedImageUrl: string, sourceType: 'AI_GENERATED' | 'MANUAL_UPLOAD') => {
    const updated = sampleHeads.map(h =>
      h.id === headId ? { ...h, imageUrl: updatedImageUrl, sourceType, updatedAt: new Date().toISOString().split('T')[0] } : h
    );
    setSampleHeads(updated);
    localStorage.setItem(`sample_heads_${project.id}`, JSON.stringify(updated));
  };

  // Customer Action Handlers
  const handleCustomerLike = (optionId: string) => {
    const updated = aiOptions.map(o => o.id === optionId ? { ...o, clientActionStatus: 'LIKED' as const } : o);
    setAiOptions(updated);
    setSelectedOption(updated.find(o => o.id === optionId) || selectedOption);
    localStorage.setItem(`ai_options_${project.id}`, JSON.stringify(updated));
    showToast(`Marked "${selectedOption.optionName}" as LIKED by Client!`);
  };

  const handleCustomerShortlist = (optionId: string) => {
    const updated = aiOptions.map(o => o.id === optionId ? { ...o, clientActionStatus: 'SHORTLISTED' as const } : o);
    setAiOptions(updated);
    setSelectedOption(updated.find(o => o.id === optionId) || selectedOption);
    localStorage.setItem(`ai_options_${project.id}`, JSON.stringify(updated));
    showToast(`Added "${selectedOption.optionName}" to Client SHORTLIST!`);
  };

  const handleCustomerReject = (optionId: string) => {
    const updated = aiOptions.map(o => o.id === optionId ? { ...o, clientActionStatus: 'REJECTED' as const } : o);
    setAiOptions(updated);
    setSelectedOption(updated.find(o => o.id === optionId) || selectedOption);
    localStorage.setItem(`ai_options_${project.id}`, JSON.stringify(updated));
    showToast(`Marked "${selectedOption.optionName}" as REJECTED.`);
  };

  const handleOpenModifyModal = (opt: AIDesignOption) => {
    setModifyingOption(opt);
    setModificationNotes(opt.clientModificationNotes || 'Client requested minor changes to wardrobe finish and kitchen island length.');
  };

  const handleSaveModification = () => {
    if (!modifyingOption) return;
    const updated = aiOptions.map(o =>
      o.id === modifyingOption.id
        ? { ...o, clientActionStatus: 'MODIFIED' as const, clientModificationNotes: modificationNotes }
        : o
    );
    setAiOptions(updated);
    setSelectedOption(updated.find(o => o.id === modifyingOption.id) || selectedOption);
    localStorage.setItem(`ai_options_${project.id}`, JSON.stringify(updated));
    showToast(`Saved client modification feedback for "${modifyingOption.optionName}"!`);
    setModifyingOption(null);
  };

  const handleOpenScheduleModal = (opt: AIDesignOption) => {
    setSchedulingOption(opt);
  };

  const handleConfirmSchedule = () => {
    if (!schedulingOption) return;
    const updated = aiOptions.map(o =>
      o.id === schedulingOption.id
        ? {
            ...o,
            clientActionStatus: 'DISCUSSION_SCHEDULED' as const,
            discussionScheduleDate: `${discussionDate} at ${discussionTime}`
          }
        : o
    );
    setAiOptions(updated);
    setSelectedOption(updated.find(o => o.id === schedulingOption.id) || selectedOption);
    localStorage.setItem(`ai_options_${project.id}`, JSON.stringify(updated));
    showToast(`Discussion scheduled for ${discussionDate} at ${discussionTime}!`);
    setSchedulingOption(null);
  };

  const handleRequestQuotation = (opt: AIDesignOption) => {
    const updated = aiOptions.map(o =>
      o.id === opt.id ? { ...o, clientActionStatus: 'QUOTATION_REQUESTED' as const } : o
    );
    setAiOptions(updated);
    setSelectedOption(updated.find(o => o.id === opt.id) || selectedOption);
    localStorage.setItem(`ai_options_${project.id}`, JSON.stringify(updated));
    showToast(`Quotation requested! Navigating to BOQ Master...`);
    if (onNavigateTab) {
      setTimeout(() => onNavigateTab('boq'), 600);
    }
  };

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
    showToast('GFC Stamp issued successfully!');
  };

  // Internal Approval of AI Option
  const handleApproveOptionInternally = (id: string) => {
    const updated = aiOptions.map(o => {
      if (o.id === id) {
        return {
          ...o,
          internalApprovalStatus: 'INTERNAL_APPROVED' as const,
          approvedByEstimatorOrLead: currentUser.name,
          approvedDate: new Date().toISOString().split('T')[0]
        };
      }
      return o;
    });
    setAiOptions(updated);
    setSelectedOption(updated.find(o => o.id === id) || selectedOption);
    localStorage.setItem(`ai_options_${project.id}`, JSON.stringify(updated));
    showToast(`Approved option internally by ${currentUser.name}`);
  };

  const handleShareWithClient = (id: string) => {
    const updated = aiOptions.map(o => {
      if (o.id === id) {
        return {
          ...o,
          internalApprovalStatus: 'SHARED_WITH_CLIENT' as const
        };
      }
      return o;
    });
    setAiOptions(updated);
    setSelectedOption(updated.find(o => o.id === id) || selectedOption);
    localStorage.setItem(`ai_options_${project.id}`, JSON.stringify(updated));
    showToast('Option shared with client presentation portal!');
  };

  const filteredDrawings = drawings.filter(d => disciplineFilter === 'ALL' || d.discipline === disciplineFilter);

  return (
    <div className="bg-[#f3f4f6] min-h-screen text-slate-800 p-4 md:p-6 space-y-5">
      {/* Toast Notification */}
      {toastText && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F6CBD] text-white px-4 py-2.5 rounded shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Top Banner with Dynamics 365 Architecture Styling */}
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded bg-[#0F6CBD] text-white flex items-center justify-center font-bold shadow-xs">
            <Sparkles className="w-5 h-5 text-amber-300" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-lg font-bold text-slate-900 leading-tight">
                Architectural Design, Discovery &amp; AI Studio
              </h1>
              <span className="text-xs bg-blue-100 text-[#0F6CBD] font-mono px-2 py-0.5 rounded font-bold">
                End-to-End Client Journey
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Structured Requirement Intake (A–H) • 64 Categorized Visual Heads (AI Regen &amp; Upload) • Visual Info Pack • 5 AI Design Concepts • CAD / GFC Revision Control
            </p>
          </div>
        </div>

        {/* Action Button Strip */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setActiveSubTab('discovery')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
              activeSubTab === 'discovery' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>1. Customer Discovery (A–H)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('heads')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
              activeSubTab === 'heads' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>2. Visual Heads (64)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('info_pack')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
              activeSubTab === 'info_pack' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>3. Visual Info Pack</span>
          </button>
          <button
            onClick={() => setActiveSubTab('ai_options')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
              activeSubTab === 'ai_options' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>4. AI Concepts (5)</span>
          </button>
          <button
            onClick={() => setActiveSubTab('drawings')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
              activeSubTab === 'drawings' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>5. CAD &amp; GFC</span>
          </button>
          <button
            onClick={() => setActiveSubTab('comparison')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-bold transition ${
              activeSubTab === 'comparison' ? 'bg-[#0F6CBD] text-white shadow-xs' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <span>6. Comparison Matrix</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: STRUCTURED CUSTOMER DISCOVERY (A through H) */}
      {activeSubTab === 'discovery' && (
        <CustomerDiscoveryFormView
          discoveryData={discoveryData}
          onSaveDiscoveryData={handleSaveDiscoveryData}
          onGenerateAIOptions={() => setActiveSubTab('ai_options')}
          onNavigateToPack={() => setActiveSubTab('info_pack')}
          project={project}
        />
      )}

      {/* VIEW 2: CATEGORY VISUAL SAMPLE HEADS (64 Heads with AI Regen & Manual Upload) */}
      {activeSubTab === 'heads' && (
        <CategoryVisualSampleHeadsView
          sampleHeads={sampleHeads}
          onUpdateHead={handleUpdateSampleHead}
          project={project}
        />
      )}

      {/* VIEW 3: PROFESSIONAL VISUAL INFORMATION PACK */}
      {activeSubTab === 'info_pack' && (
        <VisualInformationPackView
          discoveryData={discoveryData}
          sampleHeads={sampleHeads}
          project={project}
        />
      )}

      {/* VIEW 4: 5 AI DESIGN CONCEPTS WITH CUSTOMER APPROVAL ACTIONS */}
      {activeSubTab === 'ai_options' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column: 5 Generated Concepts List (4 Cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-purple-600" />
                  <span>AI Design Concepts (5 Options)</span>
                </span>
                <span className="text-[10px] bg-purple-100 text-purple-800 px-2 py-0.5 rounded font-mono font-bold">
                  {discoveryData.builtUpAreaSqFt} sq.ft
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mb-3">
                Synthesized based on customer brief. Select an option to inspect 3D renders, CAD floor plan, finishes, and customer actions.
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
                          ? 'bg-blue-50 border-[#0F6CBD] shadow-xs ring-1 ring-[#0F6CBD]/30'
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-1 mb-1">
                        <span className="font-bold text-slate-900 text-xs">{opt.optionName}</span>
                        {opt.clientActionStatus && opt.clientActionStatus !== 'NONE' && (
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                            opt.clientActionStatus === 'LIKED' ? 'bg-emerald-100 text-emerald-800' :
                            opt.clientActionStatus === 'SHORTLISTED' ? 'bg-purple-100 text-purple-800' :
                            opt.clientActionStatus === 'MODIFIED' ? 'bg-amber-100 text-amber-800' :
                            opt.clientActionStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {opt.clientActionStatus}
                          </span>
                        )}
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

          {/* Right Column: Active Option Detailed Specification & Visuals (8 Cols) */}
          <div className="lg:col-span-8 bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-5 text-xs">
            
            {/* Header of Active Option */}
            <div className="flex items-start justify-between flex-wrap gap-3 pb-4 border-b border-slate-200">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-[#0F6CBD] text-white font-mono font-bold text-xs px-2 py-0.5 rounded">
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
                <span className="text-lg font-bold text-emerald-700 font-mono">
                  ₹{(selectedOption.budgetRangeMin / 100000).toFixed(1)}L - ₹{(selectedOption.budgetRangeMax / 100000).toFixed(1)}L
                </span>
                <span className="block text-[10px] text-slate-400">Timeline: {selectedOption.estimatedTimelineWeeks} Weeks</span>
              </div>
            </div>

            {/* Visual Deliverables: 3D Photorealistic Render + 2D Measured CAD Layout */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-[#0F6CBD]" />
                <span>3D Perspective Visual &amp; 2D Architectural Layout</span>
              </span>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 group relative">
                  <img
                    src={selectedOption.renderImageUrl || '/assets/images/biophilic_concept_render_1789216627991.jpg'}
                    alt="3D Render"
                    className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                    3D Perspective Render
                  </div>
                </div>

                <div className="rounded-lg overflow-hidden border border-slate-200 bg-slate-900 group relative">
                  <img
                    src={selectedOption.layoutImageUrl || '/assets/images/cad_floor_plan_1789216705163.jpg'}
                    alt="2D Plan"
                    className="w-full h-44 object-cover group-hover:scale-105 transition duration-300"
                  />
                  <div className="absolute top-2 left-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                    2D Space-Planning Layout
                  </div>
                </div>
              </div>
            </div>

            {/* Suggested Colour Palette Swatches */}
            {selectedOption.suggestedPalette && (
              <div className="space-y-1.5">
                <span className="font-bold text-slate-900 text-xs uppercase tracking-wider block">
                  Suggested Colour Palette Swatches
                </span>
                <div className="flex items-center gap-3">
                  {selectedOption.suggestedPalette.map((color, idx) => (
                    <div key={idx} className="flex items-center gap-1.5">
                      <div
                        className="w-6 h-6 rounded border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: color }}
                      />
                      <span className="font-mono text-[10px] text-slate-600 font-semibold">{color}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Comprehensive Architectural & Interior Specifications Grid */}
            <div className="space-y-2">
              <span className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Palette className="w-3.5 h-3.5 text-purple-700" />
                <span>Interior Specifications &amp; Material Recommendations</span>
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200">
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Flooring Recommendation</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedOption.flooringRecommendation}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Wall Treatment</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedOption.wallTreatment}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Furniture Style</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedOption.furnitureStyle}</span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Lighting Style</span>
                  <span className="font-semibold text-slate-800 block mt-0.5">{selectedOption.lightingStyle}</span>
                </div>
              </div>
            </div>

            {/* Layout Concept & Space Planning Suggestions */}
            <div className="space-y-2">
              <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-[#0F6CBD]" />
                <span>Space Planning Concept</span>
              </h3>
              <div className="bg-slate-50 p-3 rounded border border-slate-200 text-slate-700 leading-relaxed">
                {selectedOption.layoutConcept}
              </div>

              <div className="space-y-1 pt-1">
                {selectedOption.spacePlanningSuggestions.map((sp, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-slate-700">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                    <span>{sp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Advantages and Limitations (Pros & Cons) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 rounded-lg bg-emerald-50/70 border border-emerald-200">
                <span className="font-bold text-emerald-900 text-xs flex items-center gap-1 mb-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Advantages &amp; Strengths</span>
                </span>
                <ul className="space-y-1 text-slate-700 text-[11px]">
                  {selectedOption.pros.map((p, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-emerald-600 font-bold">•</span>
                      <span>{p}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-3 rounded-lg bg-amber-50/70 border border-amber-200">
                <span className="font-bold text-amber-900 text-xs flex items-center gap-1 mb-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Limitations &amp; Constraints</span>
                </span>
                <ul className="space-y-1 text-slate-700 text-[11px]">
                  {selectedOption.cons.map((c, idx) => (
                    <li key={idx} className="flex items-start gap-1">
                      <span className="text-amber-600 font-bold">•</span>
                      <span>{c}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Customer Feedback Notes (if Modified or Scheduled) */}
            {selectedOption.clientModificationNotes && (
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-slate-700 space-y-1">
                <span className="font-bold text-[#0F6CBD] text-xs block">Customer Modification Feedback:</span>
                <p className="text-[11px] italic">{selectedOption.clientModificationNotes}</p>
              </div>
            )}

            {selectedOption.discussionScheduleDate && (
              <div className="p-3 rounded-lg bg-purple-50 border border-purple-200 text-slate-700 space-y-1">
                <span className="font-bold text-purple-700 text-xs block">Client Discussion Scheduled:</span>
                <p className="text-[11px] font-semibold">{selectedOption.discussionScheduleDate}</p>
              </div>
            )}

            {/* CUSTOMER APPROVAL & ACTION BUTTON BAR */}
            <div className="bg-slate-900 text-white p-4 rounded-lg shadow-sm space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-300">
                  Customer Decision &amp; Feedback Actions
                </span>
                <span className="text-[11px] text-slate-400">
                  Current Status: <strong className="text-white">{selectedOption.clientActionStatus || 'PENDING'}</strong>
                </span>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  type="button"
                  onClick={() => handleCustomerLike(selectedOption.id)}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition ${
                    selectedOption.clientActionStatus === 'LIKED'
                      ? 'bg-emerald-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Like</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCustomerShortlist(selectedOption.id)}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition ${
                    selectedOption.clientActionStatus === 'SHORTLISTED'
                      ? 'bg-purple-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Shortlist</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenModifyModal(selectedOption)}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition ${
                    selectedOption.clientActionStatus === 'MODIFIED'
                      ? 'bg-amber-500 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <Edit3 className="w-3.5 h-3.5" />
                  <span>Modify</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleCustomerReject(selectedOption.id)}
                  className={`px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition ${
                    selectedOption.clientActionStatus === 'REJECTED'
                      ? 'bg-red-600 text-white'
                      : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                  }`}
                >
                  <XCircle className="w-3.5 h-3.5" />
                  <span>Reject</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleRequestQuotation(selectedOption)}
                  className="px-3.5 py-1.5 rounded text-xs font-bold bg-[#0F6CBD] hover:bg-[#0F6CBD]/90 text-white flex items-center gap-1.5 transition ml-auto"
                >
                  <DollarSign className="w-3.5 h-3.5 text-amber-300" />
                  <span>Request Quotation &amp; BOQ</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleOpenScheduleModal(selectedOption)}
                  className="px-3.5 py-1.5 rounded text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white flex items-center gap-1.5 transition"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>Schedule Discussion</span>
                </button>
              </div>
            </div>

            {/* Internal Contractor Approval Strip */}
            <div className="bg-slate-50 p-4 rounded-lg border border-slate-200 flex items-center justify-between flex-wrap gap-3">
              <div>
                <span className="text-[11px] font-bold text-slate-700 block mb-0.5">
                  Internal Governance Approval:
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
                    <span>Share with Client</span>
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>
      )}

      {/* VIEW 5: DRAWINGS TRANSMITTAL & GFC REVISIONS */}
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
                <option value="ELECTRICAL_MEP">Electrical SLD &amp; Automation</option>
                <option value="PLUMBING_HVAC">Plumbing &amp; HVAC</option>
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
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span className="bg-black/80 text-white text-[10px] font-mono px-2 py-0.5 rounded font-bold">
                        {dwg.drawingCode}
                      </span>
                      <span className="bg-purple-700 text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        {dwg.revision}
                      </span>
                    </div>

                    {dwg.status === 'GFC_ISSUED' && (
                      <div className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 shadow-sm">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>GFC STAMPED ({dwg.gfcStampDate})</span>
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-2">
                    <h3 className="font-bold text-slate-900 text-sm">{dwg.title}</h3>
                    <div className="grid grid-cols-2 gap-2 text-xs text-slate-500">
                      <div>Sheet: <strong>{dwg.sheetSize}</strong> • Scale: <strong>{dwg.scale}</strong></div>
                      <div>Author: <strong>{dwg.author}</strong></div>
                      <div>Released: <strong>{dwg.releaseDate}</strong></div>
                      <div>Size: <strong>{dwg.fileSizeMb} MB</strong></div>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs text-slate-500">
                    Client Comments: <strong>{dwg.clientCommentsCount}</strong>
                  </span>
                  <div className="flex items-center gap-2">
                    {dwg.status !== 'GFC_ISSUED' && (
                      <button
                        onClick={() => handleIssueGFC(dwg.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition flex items-center gap-1"
                      >
                        <FileCheck className="w-3 h-3" />
                        <span>Issue GFC</span>
                      </button>
                    )}
                    <button
                      onClick={() => showToast(`Downloading CAD drawing ${dwg.drawingCode}...`)}
                      className="px-2.5 py-1 rounded border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold transition flex items-center gap-1"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 6: 5-OPTION SIDE-BY-SIDE COMPARISON MATRIX */}
      {activeSubTab === 'comparison' && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm">5-Option Side-by-Side Comparison Matrix</h3>
            <span className="text-slate-500 text-xs">Architectural, Commercial &amp; Timeline Synthesis</span>
          </div>

          <div className="overflow-x-auto border border-slate-200 rounded">
            <table className="w-full text-left">
              <thead className="bg-slate-50 text-slate-600 border-b border-slate-200 text-xs">
                <tr>
                  <th className="p-3">Evaluation Parameter</th>
                  {aiOptions.map(o => (
                    <th key={o.id} className="p-3 font-bold text-slate-900 min-w-[180px]">
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
                    <td key={o.id} className="p-3 font-bold font-mono text-emerald-700">
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
                  <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Flooring Spec</td>
                  {aiOptions.map(o => (
                    <td key={o.id} className="p-3 text-slate-600">{o.flooringRecommendation}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Wall Treatment</td>
                  {aiOptions.map(o => (
                    <td key={o.id} className="p-3 text-slate-600">{o.wallTreatment}</td>
                  ))}
                </tr>
                <tr>
                  <td className="p-3 font-bold text-slate-700 bg-slate-50/50">Customer Decision</td>
                  {aiOptions.map(o => (
                    <td key={o.id} className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                        o.clientActionStatus === 'LIKED' ? 'bg-emerald-100 text-emerald-800' :
                        o.clientActionStatus === 'SHORTLISTED' ? 'bg-purple-100 text-purple-800' :
                        o.clientActionStatus === 'MODIFIED' ? 'bg-amber-100 text-amber-800' :
                        o.clientActionStatus === 'REJECTED' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-600'
                      }`}>
                        {o.clientActionStatus || 'PENDING REVIEW'}
                      </span>
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* MODIFY OPTION FEEDBACK MODAL */}
      {modifyingOption && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-amber-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Record Customer Modification: {modifyingOption.optionName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setModifyingOption(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-slate-500 text-[11px]">
                Enter the specific adjustments or material variations requested by the customer to update this concept sheet.
              </p>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Customer Revision Notes</label>
                <textarea
                  rows={4}
                  value={modificationNotes}
                  onChange={e => setModificationNotes(e.target.value)}
                  placeholder="e.g. Increase kitchen island to 9 feet, switch wardrobe shutter to fluted glass, change living room flooring to Botticino..."
                  className="w-full px-3 py-2 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setModifyingOption(null)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveModification}
                className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs font-bold"
              >
                Save Client Modification
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SCHEDULE DISCUSSION MODAL */}
      {schedulingOption && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-xl max-w-lg w-full p-5 space-y-4 animate-in fade-in">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-purple-600" />
                <h3 className="font-bold text-slate-900 text-sm">
                  Schedule Client Design Review: {schedulingOption.optionName}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSchedulingOption(null)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Meeting Date</label>
                  <input
                    type="date"
                    value={discussionDate}
                    onChange={e => setDiscussionDate(e.target.value)}
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Meeting Time</label>
                  <input
                    type="text"
                    value={discussionTime}
                    onChange={e => setDiscussionTime(e.target.value)}
                    placeholder="11:00 AM"
                    className="w-full px-3 py-1.5 border border-slate-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Agenda &amp; Deliverables to Review</label>
                <textarea
                  rows={3}
                  value={discussionAgenda}
                  onChange={e => setDiscussionAgenda(e.target.value)}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="p-2.5 rounded bg-purple-50 border border-purple-200 text-[11px] text-purple-900">
                An invite will be automatically logged to the project timeline for client {discoveryData.customerName} ({discoveryData.mobile}).
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setSchedulingOption(null)}
                className="px-3 py-1.5 border border-slate-300 rounded text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmSchedule}
                className="px-4 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded text-xs font-bold"
              >
                Confirm &amp; Notify Client
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
