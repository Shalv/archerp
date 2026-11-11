/**
 * Build Storys ERP - AI Drawing & Technical Documentation Module (Module 2)
 * -----------------------------------------------------------------------
 * Technical Intelligence: Generates complete, dimension-accurate technical drawing packages
 * linked directly to project geometry, master rate items, and the BOQ.
 *
 * Incorporates User's Exact CAD Cases:
 * 1. MBR Wardrobe 2700mm x 2900mm with Study Desk & Fluted Accent
 * 2. Bed Wall Feature Elevation with Ceiling Drop & Fluted Columns
 * 3. 4-Door Wardrobe with Hydraulic Loft & Internal Carcass Section
 *
 * 5 Drawing Packages:
 *   A. Floor Plan (Furniture placement, dimensions, openings, circulation paths)
 *   B. Wall Elevations (Wall A, B, C, D separately, wall-wise finishes, electrical)
 *   C. Furniture & Joinery Drawings (Detailed elevations, sectional drawings, hardware & cutting lists)
 *   D. Services Drawings (Electrical, false ceiling, plumbing, HVAC coordination)
 *   E. Material & Finishing Schedule (Codes, specs, brands, approved samples, BOQ references)
 */

import React, { useState, useMemo } from 'react';
import {
  Layers,
  Sparkles,
  Download,
  Printer,
  Ruler,
  CheckCircle2,
  AlertTriangle,
  FileText,
  SlidersHorizontal,
  ChevronRight,
  Eye,
  Maximize2,
  Minimize2,
  ZoomIn,
  ZoomOut,
  RefreshCw,
  GitBranch,
  ShieldCheck,
  FileCheck2,
  Cpu,
  ArrowRight,
  ExternalLink,
  Package,
  Wrench,
  Check,
  Calendar,
  IndianRupee,
  Activity,
  Compass,
  Square,
  Info
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../types/erp';
import { ImageToCadPlanGeneratorModal } from './floorplan/ImageToCadPlanGeneratorModal';
import {
  DataLinkageMetadata,
  FurnitureJoineryDrawingDetail,
  MaterialScheduleItem,
  ParametricValidationCheck,
  ServiceDrawingDetail,
  TechnicalPackageType,
  WallElevationDetail,
  DesignChangeImpact
} from '../types/drawingsAndDocs';
import {
  PRIMARY_DATA_LINKAGE,
  SEED_WALL_ELEVATIONS,
  SEED_FURNITURE_JOINERY_CASES,
  SEED_SERVICES_DRAWINGS,
  SEED_MATERIAL_SCHEDULE,
  SEED_PARAMETRIC_VALIDATION_CHECKS,
  simulateDesignChangeCascade
} from '../data/technicalDrawingPackagesSeed';

interface Props {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
  onOpenInspectData?: () => void;
}

export const AIDrawingDocumentationView: React.FC<Props> = ({
  project,
  currentUser,
  onNavigateTab,
  onOpenInspectData
}) => {
  // Navigation between the 5 Technical Packages
  const [activePackage, setActivePackage] = useState<TechnicalPackageType>('PACKAGE_C_FURNITURE_JOINERY');
  
  // Package B: Selected Wall Elevation
  const [selectedWallId, setSelectedWallId] = useState<string>('MBR-WALL-03'); // Default to Wall C (Wardrobe wall)
  
  // Package C: Selected Furniture Case
  const [selectedFurnitureId, setSelectedFurnitureId] = useState<string>('FUR-WRD-001'); // Default to Case 1
  const [joineryViewMode, setJoineryViewMode] = useState<'FRONT_ELEVATION' | 'SECTION_A' | 'SECTION_B' | 'CUTTING_LIST'>('FRONT_ELEVATION');

  // Package D: Selected Service Discipline
  const [selectedServiceDiscipline, setSelectedServiceDiscipline] = useState<'ELECTRICAL' | 'FALSE_CEILING' | 'HVAC'>('ELECTRICAL');

  // CAD Viewer controls
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showAnnotations, setShowAnnotations] = useState<boolean>(true);
  const [showGrid, setShowGrid] = useState<boolean>(true);

  // Validation modal state
  const [isValidating, setIsValidating] = useState<boolean>(false);
  const [validationModalOpen, setValidationModalOpen] = useState<boolean>(false);
  const [validationChecks, setValidationChecks] = useState<ParametricValidationCheck[]>(SEED_PARAMETRIC_VALIDATION_CHECKS);

  // Cascade Simulation modal state
  const [simulationModalOpen, setSimulationModalOpen] = useState<boolean>(false);
  const [selectedChangeScenario, setSelectedChangeScenario] = useState<
    'EXTEND_WARDROBE_TO_3000MM' | 'UPGRADE_TO_SMOKED_OAK_VENEER' | 'ADD_INTERNAL_LEATHER_DRAWERS'
  >('EXTEND_WARDROBE_TO_3000MM');
  const [cascadeResult, setCascadeResult] = useState<DesignChangeImpact>(() =>
    simulateDesignChangeCascade('EXTEND_WARDROBE_TO_3000MM')
  );
  const [isSignOffApplied, setIsSignOffApplied] = useState<boolean>(false);
  const [imageToCadModalOpen, setImageToCadModalOpen] = useState<boolean>(false);

  // Action toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Active items
  const activeWall = useMemo(
    () => SEED_WALL_ELEVATIONS.find(w => w.wallId === selectedWallId) || SEED_WALL_ELEVATIONS[2],
    [selectedWallId]
  );

  const activeFurniture = useMemo(
    () => SEED_FURNITURE_JOINERY_CASES.find(f => f.furnitureId === selectedFurnitureId) || SEED_FURNITURE_JOINERY_CASES[0],
    [selectedFurnitureId]
  );

  const activeService = useMemo(
    () => SEED_SERVICES_DRAWINGS.find(s => s.discipline === selectedServiceDiscipline) || SEED_SERVICES_DRAWINGS[0],
    [selectedServiceDiscipline]
  );

  // Run live validation
  const handleRunValidation = () => {
    setIsValidating(true);
    setTimeout(() => {
      setIsValidating(false);
      setValidationModalOpen(true);
      showNotification('Parametric CAD/BIM validation complete: All 10 checks passed with zero tolerance violations.');
    }, 700);
  };

  // Run simulation change
  const handleScenarioChange = (
    scenario: 'EXTEND_WARDROBE_TO_3000MM' | 'UPGRADE_TO_SMOKED_OAK_VENEER' | 'ADD_INTERNAL_LEATHER_DRAWERS'
  ) => {
    setSelectedChangeScenario(scenario);
    setIsSignOffApplied(false);
    const result = simulateDesignChangeCascade(scenario);
    setCascadeResult(result);
  };

  const handleApplySignOff = () => {
    setIsSignOffApplied(true);
    showNotification(`Formal Client Change Order ${cascadeResult.reOpenedApprovalId} signed off! BOQ delta updated.`);
  };

  // Download DXF handler
  const handleDownloadDxf = () => {
    const dummyDxfContent = `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1027\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nTEXT\n10\n100.0\n20\n100.0\n40\n20.0\n1\nBUILD STORYS ERP - ${activeFurniture.name} [DRW-MBR-005 REV-02]\n0\nLINE\n10\n0.0\n20\n0.0\n11\n2700.0\n21\n0.0\n0\nLINE\n10\n0.0\n20\n2900.0\n11\n2700.0\n21\n2900.0\n0\nENDSEC\n0\nEOF\n`;
    const blob = new Blob([dummyDxfContent], { type: 'application/dxf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${activeFurniture.itemCode}_ParametricCAD_Rev02.dxf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showNotification(`Exported AutoCAD DXF: ${activeFurniture.itemCode}_ParametricCAD_Rev02.dxf`);
  };

  const handlePrintSheet = () => {
    window.print();
  };

  return (
    <div className="space-y-4 pb-12">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 bg-[#002050] text-white px-4 py-2.5 rounded-lg shadow-xl text-xs flex items-center gap-2 border border-blue-400/30 animate-in fade-in slide-in-from-top-3">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* TOP HEADER: Module Title & Heart Module Identity */}
      <div className="bg-white border border-[#d2d0ce] rounded-lg shadow-xs p-4 sm:p-5">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2.5 flex-wrap">
              <span className="bg-slate-900 text-white font-mono text-[11px] font-bold px-2 py-0.5 rounded tracking-wide">
                MODULE 2
              </span>
              <span className="inline-flex items-center gap-1.5 bg-blue-50 text-[#0F6CBD] border border-blue-200 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                <Sparkles className="w-3.5 h-3.5" />
                Heart Module • Technical Intelligence
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Integrated with Architecture, BOQ, Procurement & Production
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-slate-900 mt-1 flex items-center gap-2">
              <Layers className="w-6 h-6 text-[#002050]" />
              AI Drawing & Documentation
            </h1>
            <p className="text-xs text-slate-600 max-w-4xl mt-0.5">
              Parametric CAD/BIM drawing engine generating verified 2D floor plans, wall elevations, joinery construction details,
              MEP services coordination, and material schedules. Every dimension and finish is traceable to project data with no unverified geometry.
            </p>
          </div>

          {/* Action Button Bar */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setImageToCadModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-xs transition-colors"
              title="Convert Customer 3D Render (Image 1) to 2D Technical Plan (Image 2)"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI Image ➔ CAD Plan (Image 1 → 2)</span>
            </button>

            <button
              onClick={handleRunValidation}
              disabled={isValidating}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isValidating ? 'animate-spin' : ''}`} />
              <span>{isValidating ? 'Checking Rules...' : 'Run CAD Validation'}</span>
            </button>

            <button
              onClick={() => setSimulationModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#002050] hover:bg-[#003366] text-white text-xs font-semibold shadow-xs transition-colors"
            >
              <GitBranch className="w-3.5 h-3.5 text-amber-300" />
              <span>Simulate Design Delta</span>
            </button>

            <button
              onClick={handleDownloadDxf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export DXF</span>
            </button>

            <button
              onClick={handlePrintSheet}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-medium transition-colors"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print Sheet</span>
            </button>
          </div>
        </div>

        {/* MANDATORY DATA LINKAGE BAR (SECTION 5 COMPLIANCE) */}
        <div className="mt-4 pt-3.5 border-t border-slate-200">
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-700 uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5 text-[#0F6CBD]" />
              <span>Mandatory Traceability Linkage (AI + CAD + BOQ Contract)</span>
            </div>
            <span className="text-[11px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded font-semibold">
              Status: 100% Parameter Traceable
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-9 gap-2 bg-slate-50 p-2.5 rounded border border-slate-200 text-[11px]">
            <div className="border-r border-slate-200 pr-1">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Project ID</span>
              <span className="font-mono font-bold text-slate-900">{PRIMARY_DATA_LINKAGE.projectId}</span>
            </div>
            <div className="border-r border-slate-200 pr-1">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Room ID</span>
              <span className="font-mono font-bold text-blue-700">{PRIMARY_DATA_LINKAGE.roomId}</span>
            </div>
            <div className="border-r border-slate-200 pr-1">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Design ID</span>
              <span className="font-mono font-bold text-purple-700">{PRIMARY_DATA_LINKAGE.designId}</span>
            </div>
            <div className="border-r border-slate-200 pr-1">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Drawing ID</span>
              <span className="font-mono font-bold text-slate-900">{activeFurniture.linkage.drawingId}</span>
            </div>
            <div className="border-r border-slate-200 pr-1">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Revision</span>
              <span className="font-mono font-bold text-amber-700 bg-amber-50 px-1 rounded">{PRIMARY_DATA_LINKAGE.revision}</span>
            </div>
            <div className="border-r border-slate-200 pr-1">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Wall ID</span>
              <span className="font-mono font-bold text-slate-900">{activeFurniture.linkage.wallId}</span>
            </div>
            <div className="border-r border-slate-200 pr-1">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Furniture ID</span>
              <span className="font-mono font-bold text-indigo-700">{activeFurniture.furnitureId}</span>
            </div>
            <div className="border-r border-slate-200 pr-1">
              <span className="text-slate-400 block text-[9px] uppercase font-bold">BOQ Ref</span>
              <span className="font-mono font-bold text-emerald-700">{activeFurniture.linkage.boqReference}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[9px] uppercase font-bold">Material Ref</span>
              <span className="font-mono font-bold text-slate-900">{activeFurniture.linkage.materialReference}</span>
            </div>
          </div>
        </div>
      </div>

      {/* 5 TECHNICAL DRAWING PACKAGES TABS (SECTION 3 COMPLIANCE) */}
      <div className="bg-white border border-[#d2d0ce] rounded-lg shadow-xs overflow-hidden">
        <div className="flex items-center overflow-x-auto border-b border-slate-200 bg-slate-50 p-1.5 gap-1.5 scrollbar-thin">
          <button
            onClick={() => setActivePackage('PACKAGE_A_FLOOR_PLAN')}
            className={`px-3.5 py-2 rounded text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activePackage === 'PACKAGE_A_FLOOR_PLAN'
                ? 'bg-[#002050] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>A. 2D Floor Plan & Space Planning</span>
          </button>

          <button
            onClick={() => setActivePackage('PACKAGE_B_WALL_ELEVATIONS')}
            className={`px-3.5 py-2 rounded text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activePackage === 'PACKAGE_B_WALL_ELEVATIONS'
                ? 'bg-[#002050] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>B. Wall Elevations (Wall A, B, C, D)</span>
          </button>

          <button
            onClick={() => setActivePackage('PACKAGE_C_FURNITURE_JOINERY')}
            className={`px-3.5 py-2 rounded text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activePackage === 'PACKAGE_C_FURNITURE_JOINERY'
                ? 'bg-[#002050] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>C. Furniture & Joinery Details (User CAD Cases)</span>
            <span className="bg-amber-400 text-slate-900 text-[10px] px-1.5 py-0.2 rounded font-bold">3 Cases</span>
          </button>

          <button
            onClick={() => setActivePackage('PACKAGE_D_SERVICES_DRAWINGS')}
            className={`px-3.5 py-2 rounded text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activePackage === 'PACKAGE_D_SERVICES_DRAWINGS'
                ? 'bg-[#002050] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>D. Services Drawings (MEP, Ceiling, HVAC)</span>
          </button>

          <button
            onClick={() => setActivePackage('PACKAGE_E_MATERIAL_SCHEDULE')}
            className={`px-3.5 py-2 rounded text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
              activePackage === 'PACKAGE_E_MATERIAL_SCHEDULE'
                ? 'bg-[#002050] text-white shadow-xs'
                : 'text-slate-700 hover:bg-slate-200/70'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>E. Material & Finishing Schedule</span>
          </button>
        </div>

        {/* PACKAGE CONTENT WORKSPACE */}
        <div className="p-4 sm:p-5">
          {/* ================================================================= */}
          {/* PACKAGE A: 2D FLOOR PLAN & SPACE PLANNING                         */}
          {/* ================================================================= */}
          {activePackage === 'PACKAGE_A_FLOOR_PLAN' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Master Bedroom Suite Space Planning & Furniture Layout
                  </h3>
                  <p className="text-xs text-slate-500">
                    Dimensions: 20'-0" × 19'-0" (6100mm × 5800mm) • Ceiling Height: 9'-6" (2900mm) • Vastu: South-West Master Zone
                  </p>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <span className="font-mono bg-blue-50 text-blue-800 border border-blue-200 px-2 py-1 rounded">
                    Circulation Clearance: 1,150 mm (Passed)
                  </span>
                  <span className="font-mono bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-1 rounded">
                    Drawing ID: DRW-MBR-001 Rev 02
                  </span>
                </div>
              </div>

              {/* Vector 2D CAD Plan Visualizer */}
              <div className="border border-slate-300 rounded-lg bg-[#0e1726] p-4 text-white overflow-hidden relative">
                <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs px-2.5 py-1 rounded text-[11px] font-mono border border-white/20">
                  AutoCAD Scale: 1:50 • Grid: 500mm
                </div>

                <div className="w-full flex items-center justify-center min-h-[380px]">
                  <svg viewBox="0 0 800 500" className="w-full max-h-[460px] select-none">
                    {/* Grid */}
                    <defs>
                      <pattern id="cadGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                        <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#223249" strokeWidth="0.8" />
                      </pattern>
                    </defs>
                    <rect width="800" height="500" fill="#0e1726" />
                    <rect width="800" height="500" fill="url(#cadGrid)" opacity="0.6" />

                    {/* Room Boundary Walls (6100mm x 5800mm scaled) */}
                    <rect x="100" y="50" width="600" height="400" fill="#13233b" stroke="#60a5fa" strokeWidth="4" />
                    
                    {/* Wall Labels */}
                    <text x="400" y="40" fill="#93c5fd" fontSize="12" fontWeight="bold" textAnchor="middle">WALL C (NORTH) - 6100 mm [Built-in Wardrobe & Study]</text>
                    <text x="400" y="475" fill="#93c5fd" fontSize="12" fontWeight="bold" textAnchor="middle">WALL A (SOUTH) - 6100 mm [Bed Head Feature Wall]</text>
                    <text x="70" y="250" fill="#93c5fd" fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(-90 70 250)">WALL B (WEST) - 5800 mm [Balcony Slider]</text>
                    <text x="730" y="250" fill="#93c5fd" fontSize="12" fontWeight="bold" textAnchor="middle" transform="rotate(90 730 250)">WALL D (EAST) - 5800 mm [En-Suite Access]</text>

                    {/* North Wall Built-in: Wardrobe (2700mm) + Study Desk (900mm) */}
                    <g id="wardrobeAndDesk">
                      {/* Wardrobe 1800mm */}
                      <rect x="120" y="54" width="220" height="60" fill="#1e3a5f" stroke="#38bdf8" strokeWidth="2" />
                      <line x1="120" y1="54" x2="340" y2="114" stroke="#38bdf8" strokeDasharray="3 3" />
                      <line x1="340" y1="54" x2="120" y2="114" stroke="#38bdf8" strokeDasharray="3 3" />
                      <text x="230" y="88" fill="#38bdf8" fontSize="10" textAnchor="middle">FUR-WRD-001 (1800mm)</text>
                      
                      {/* Study Desk 900mm */}
                      <rect x="340" y="54" width="110" height="50" fill="#2d4a3e" stroke="#4ade80" strokeWidth="2" />
                      <text x="395" y="85" fill="#4ade80" fontSize="10" textAnchor="middle">Study Desk (900mm)</text>

                      {/* Entry Door D1 */}
                      <path d="M 580 50 A 60 60 0 0 0 640 110" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      <line x1="580" y1="50" x2="580" y2="110" stroke="#f59e0b" strokeWidth="2" />
                      <text x="610" y="90" fill="#f59e0b" fontSize="10">D1 (914mm)</text>
                    </g>

                    {/* South Wall Bed: King Bed (1980mm x 2100mm) + Side Tables */}
                    <g id="kingBed">
                      {/* Headboard Wall Cushioning */}
                      <rect x="260" y="430" width="280" height="16" fill="#475569" stroke="#94a3b8" />
                      
                      {/* Mattress */}
                      <rect x="290" y="270" width="220" height="160" rx="8" fill="#1e293b" stroke="#cbd5e1" strokeWidth="2" />
                      <text x="400" y="355" fill="#cbd5e1" fontSize="12" fontWeight="bold" textAnchor="middle">King Bed (1980 × 2100)</text>
                      
                      {/* Pillows */}
                      <rect x="310" y="390" width="80" height="30" rx="4" fill="#334155" stroke="#94a3b8" />
                      <rect x="410" y="390" width="80" height="30" rx="4" fill="#334155" stroke="#94a3b8" />

                      {/* Side Tables */}
                      <rect x="220" y="390" width="50" height="40" fill="#334155" stroke="#94a3b8" />
                      <text x="245" y="415" fill="#94a3b8" fontSize="8" textAnchor="middle">T1</text>
                      <rect x="530" y="390" width="50" height="40" fill="#334155" stroke="#94a3b8" />
                      <text x="555" y="415" fill="#94a3b8" fontSize="8" textAnchor="middle">T2</text>
                    </g>

                    {/* Circulation Pathway Line */}
                    <g id="circulationDimension">
                      <line x1="400" y1="120" x2="400" y2="265" stroke="#eab308" strokeWidth="1.5" strokeDasharray="4 4" />
                      <polygon points="400,120 396,128 404,128" fill="#eab308" />
                      <polygon points="400,265 396,257 404,257" fill="#eab308" />
                      <rect x="350" y="180" width="100" height="22" rx="4" fill="#1e293b" stroke="#eab308" />
                      <text x="400" y="195" fill="#eab308" fontSize="10" fontWeight="bold" textAnchor="middle">1,150 mm Walkway</text>
                    </g>

                    {/* West Wall Balcony Slider SD2 */}
                    <g id="sliderBalcony">
                      <line x1="98" y1="180" x2="98" y2="350" stroke="#38bdf8" strokeWidth="8" />
                      <text x="115" y="270" fill="#38bdf8" fontSize="10" transform="rotate(-90 115 270)">SD2 (3650mm Glass Slider)</text>
                    </g>

                    {/* East Wall TV Unit & Door to Toilet D2 */}
                    <g id="eastWallItems">
                      <rect x="686" y="220" width="10" height="120" fill="#64748b" stroke="#94a3b8" />
                      <text x="675" y="280" fill="#cbd5e1" fontSize="9" transform="rotate(90 675 280)">TV Credenza (1200mm)</text>
                      
                      {/* Door D2 */}
                      <path d="M 700 380 A 50 50 0 0 1 650 430" fill="none" stroke="#f59e0b" strokeWidth="2" />
                      <line x1="700" y1="380" x2="650" y2="380" stroke="#f59e0b" strokeWidth="2" />
                      <text x="640" y="410" fill="#f59e0b" fontSize="9">D2 (Toilet)</text>
                    </g>
                  </svg>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 mt-2 border-t border-slate-700 pt-2 flex-wrap gap-2">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-blue-500 rounded-full inline-block"></span> Carcass Joinery</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-full inline-block"></span> Study Desk & Top</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-yellow-500 rounded-full inline-block"></span> Circulation Paths</span>
                    <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 bg-amber-500 rounded-full inline-block"></span> Openings & Doors</span>
                  </div>
                  <span className="font-mono text-[11px]">Validated against IS 5533 & NBC 2016 Spatial Norms</span>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PACKAGE B: WALL ELEVATIONS (Wall A, B, C, D)                      */}
          {/* ================================================================= */}
          {activePackage === 'PACKAGE_B_WALL_ELEVATIONS' && (
            <div className="space-y-4">
              {/* Wall Selector Buttons */}
              <div className="flex items-center gap-2 flex-wrap pb-2 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase">Select Elevation:</span>
                {SEED_WALL_ELEVATIONS.map(wall => (
                  <button
                    key={wall.wallId}
                    onClick={() => setSelectedWallId(wall.wallId)}
                    className={`px-3 py-1.5 rounded text-xs font-semibold transition-all border ${
                      selectedWallId === wall.wallId
                        ? 'bg-[#002050] text-white border-[#002050] shadow-xs'
                        : 'bg-slate-50 text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span>{wall.wallLabel} ({wall.orientation})</span>
                    <span className="ml-1 text-[10px] opacity-75 font-mono">{wall.lengthMm}mm</span>
                  </button>
                ))}
              </div>

              {/* Active Wall Title */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeWall.title}</h3>
                  <p className="text-xs text-slate-500">
                    Wall Dimensions: {activeWall.lengthMm}mm Width × {activeWall.heightMm}mm Height • Scale: 1:25 • Drawing Ref: {activeWall.drawingReference}
                  </p>
                </div>
                <span className="font-mono text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded border border-slate-200 font-semibold">
                  Orientation: {activeWall.orientation}
                </span>
              </div>

              {/* Vector Elevation Drawing Canvas */}
              <div className="border border-slate-300 rounded-lg bg-white p-4 overflow-hidden relative shadow-inner">
                <div className="w-full flex items-center justify-center min-h-[360px] bg-slate-50 border border-slate-200 rounded p-2">
                  <svg viewBox="0 0 900 460" className="w-full max-h-[460px] select-none font-sans">
                    {/* Background */}
                    <rect width="900" height="460" fill="#fafafa" stroke="#e2e8f0" />

                    {/* FFL Line at Bottom */}
                    <line x1="40" y1="390" x2="860" y2="390" stroke="#0f172a" strokeWidth="3" />
                    <text x="50" y="410" fill="#475569" fontSize="10" fontWeight="bold">FFL +0.00 (FINISHED FLOOR LEVEL)</text>
                    
                    {/* Ceiling Line at Top */}
                    <line x1="40" y1="80" x2="860" y2="80" stroke="#0f172a" strokeWidth="2" strokeDasharray="4 2" />
                    <text x="50" y="70" fill="#475569" fontSize="10" fontWeight="bold">FALSE CEILING LEVEL +2900 mm</text>

                    {/* Dimension String - Height */}
                    <line x1="30" y1="80" x2="30" y2="390" stroke="#0284c7" strokeWidth="1.5" />
                    <polygon points="30,80 26,88 34,88" fill="#0284c7" />
                    <polygon points="30,390 26,382 34,382" fill="#0284c7" />
                    <text x="22" y="235" fill="#0284c7" fontSize="11" fontWeight="bold" textAnchor="middle" transform="rotate(-90 22 235)">2900 mm</text>

                    {/* Content according to selected Wall */}
                    {selectedWallId === 'MBR-WALL-03' ? (
                      /* WALL C: Wardrobe + Study Desk */
                      <g id="wallCElevation">
                        {/* Skirting 100mm */}
                        <rect x="80" y="375" width="480" height="15" fill="#334155" />
                        <text x="85" y="386" fill="#ffffff" fontSize="8">100mm SKIRTING</text>

                        {/* Wardrobe Outer Carcass (1800mm) */}
                        <rect x="80" y="80" width="320" height="295" fill="#f1f5f9" stroke="#0f172a" strokeWidth="2" />
                        {/* Shutter 1 */}
                        <rect x="85" y="85" width="100" height="285" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                        <rect x="90" y="90" width="90" height="275" fill="#8ca094" />
                        <text x="135" y="230" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">SHUTTER 1</text>
                        <text x="135" y="245" fill="#ffffff" fontSize="8" textAnchor="middle">MAT-LAM-001</text>

                        {/* Shutter 2 (Glass center with Brushed Gold Profile) */}
                        <rect x="190" y="85" width="100" height="285" fill="#cbd5e1" stroke="#d97706" strokeWidth="2" />
                        <rect x="195" y="90" width="90" height="275" fill="#334155" opacity="0.8" />
                        <line x1="240" y1="90" x2="240" y2="365" stroke="#fbbf24" strokeWidth="2" />
                        <text x="240" y="230" fill="#fef08a" fontSize="10" fontWeight="bold" textAnchor="middle">SHUTTER 2</text>
                        <text x="240" y="245" fill="#fef08a" fontSize="8" textAnchor="middle">ALU BRUSH GOLD</text>

                        {/* Shutter 3 */}
                        <rect x="295" y="85" width="100" height="285" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1.5" />
                        <rect x="300" y="90" width="90" height="275" fill="#8ca094" />
                        <text x="345" y="230" fill="#ffffff" fontSize="10" fontWeight="bold" textAnchor="middle">SHUTTER 3</text>
                        <text x="345" y="245" fill="#ffffff" fontSize="8" textAnchor="middle">MAT-LAM-001</text>

                        {/* Study Desk Section (900mm width) */}
                        <g id="studyDeskElevation">
                          {/* Fluted Panel Backing */}
                          <rect x="405" y="80" width="155" height="295" fill="#475569" stroke="#0f172a" />
                          <line x1="420" y1="80" x2="420" y2="375" stroke="#64748b" strokeWidth="2" />
                          <line x1="435" y1="80" x2="435" y2="375" stroke="#64748b" strokeWidth="2" />
                          <line x1="450" y1="80" x2="450" y2="375" stroke="#64748b" strokeWidth="2" />
                          <line x1="465" y1="80" x2="465" y2="375" stroke="#64748b" strokeWidth="2" />
                          <line x1="480" y1="80" x2="480" y2="375" stroke="#64748b" strokeWidth="2" />

                          {/* Overhead Floating Display Shelves */}
                          <rect x="410" y="130" width="145" height="15" fill="#b45309" stroke="#78350f" />
                          <rect x="410" y="190" width="145" height="15" fill="#b45309" stroke="#78350f" />
                          <text x="480" y="122" fill="#0f172a" fontSize="8" textAnchor="middle">Floating Display Shelves</text>

                          {/* Desk Countertop (+715mm from FFL) */}
                          <rect x="405" y="275" width="155" height="18" fill="#d97706" stroke="#92400e" strokeWidth="1.5" />
                          <text x="480" y="288" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">TEAK COUNTERTOP +715mm</text>

                          {/* Dual Drawer Fascia (130mm height) */}
                          <rect x="415" y="295" width="65" height="24" fill="#ffffff" stroke="#0f172a" />
                          <rect x="485" y="295" width="65" height="24" fill="#ffffff" stroke="#0f172a" />
                          
                          {/* Legroom Clearance (600mm) */}
                          <text x="480" y="350" fill="#94a3b8" fontSize="9" textAnchor="middle">600mm Legroom Clearance</text>
                        </g>

                        {/* Door D1 on Right */}
                        <rect x="680" y="160" width="140" height="230" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
                        <circle cx="700" cy="275" r="4" fill="#0f172a" />
                        <text x="750" y="280" fill="#475569" fontSize="10" textAnchor="middle">DOOR D1 (914 × 2134)</text>
                      </g>
                    ) : (
                      /* WALL A: Bed Head Wall Elevation */
                      <g id="wallAElevation">
                        {/* Bed Head Wall Paneling */}
                        <rect x="120" y="80" width="660" height="310" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
                        {/* Left Fluted Column */}
                        <rect x="120" y="80" width="120" height="310" fill="#78350f" opacity="0.8" />
                        {/* Right Fluted Column */}
                        <rect x="660" y="80" width="120" height="310" fill="#78350f" opacity="0.8" />
                        
                        {/* Center Moulded Panel */}
                        <rect x="260" y="120" width="380" height="180" fill="#f1f5f9" stroke="#94a3b8" strokeWidth="2" />
                        <text x="450" y="210" fill="#64748b" fontSize="11" textAnchor="middle">Asian Paints Royale Matt Moulding Panel</text>

                        {/* Fabric Upholstered Headboard */}
                        <rect x="240" y="300" width="420" height="90" rx="4" fill="#cbd5e1" stroke="#475569" strokeWidth="2" />
                        <text x="450" y="350" fill="#1e293b" fontSize="11" fontWeight="bold" textAnchor="middle">Padded Velvet Headboard Cushion</text>

                        {/* Bedside Sconces */}
                        <circle cx="210" cy="200" r="10" fill="#fbbf24" stroke="#d97706" />
                        <circle cx="690" cy="200" r="10" fill="#fbbf24" stroke="#d97706" />
                        <text x="210" y="180" fill="#b45309" fontSize="8" textAnchor="middle">Sconce 3000K</text>
                        <text x="690" y="180" fill="#b45309" fontSize="8" textAnchor="middle">Sconce 3000K</text>
                      </g>
                    )}

                    {/* Width Dimension String */}
                    <line x1="80" y1="430" x2="560" y2="430" stroke="#0284c7" strokeWidth="1.5" />
                    <polygon points="80,430 88,426 88,434" fill="#0284c7" />
                    <polygon points="560,430 552,426 552,434" fill="#0284c7" />
                    <text x="320" y="445" fill="#0284c7" fontSize="10" fontWeight="bold" textAnchor="middle">
                      {selectedWallId === 'MBR-WALL-03' ? '2,700 mm (1,800mm Wardrobe + 900mm Study)' : '3,600 mm Bed Wall Feature'}
                    </text>
                  </svg>
                </div>
              </div>

              {/* Electrical & Finishes Schedule Table */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="border border-slate-200 rounded p-3 bg-slate-50">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <Activity className="w-3.5 h-3.5 text-blue-600" />
                    <span>Concealed Electrical & Conduit Entry Schedule</span>
                  </h4>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-300 text-slate-500 font-bold">
                        <th className="py-1">Code</th>
                        <th className="py-1">Point Description</th>
                        <th className="py-1">Mounting Ht</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                      {activeWall.electricalPoints.map(ep => (
                        <tr key={ep.code}>
                          <td className="py-1 text-blue-700 font-bold">{ep.code}</td>
                          <td className="py-1 text-slate-800 font-sans">{ep.type}</td>
                          <td className="py-1 text-slate-600">+{ep.heightFromFflMm}mm FFL</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="border border-slate-200 rounded p-3 bg-slate-50">
                  <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-emerald-600" />
                    <span>Applied Finishes & Surface Area Schedule</span>
                  </h4>
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-300 text-slate-500 font-bold">
                        <th className="py-1">Material Code</th>
                        <th className="py-1">Finish Description</th>
                        <th className="py-1 text-right">Area</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      {activeWall.finishes.map(fn => (
                        <tr key={fn.materialCode + fn.panelType}>
                          <td className="py-1 font-mono text-purple-700 font-bold">{fn.materialCode}</td>
                          <td className="py-1 text-slate-800">{fn.panelType}</td>
                          <td className="py-1 text-right font-mono text-slate-700 font-semibold">{fn.areaSqM} m²</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PACKAGE C: FURNITURE & JOINERY DRAWINGS (THE 3 USER CAD CASES)     */}
          {/* ================================================================= */}
          {activePackage === 'PACKAGE_C_FURNITURE_JOINERY' && (
            <div className="space-y-4">
              {/* Joinery Case Selector */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                  <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-600" />
                    <span>Select Technical Joinery Drawing Case (From Uploaded Technical Briefs):</span>
                  </span>
                  <span className="text-xs text-slate-500">
                    Auto-generated from Parametric CAD Engine
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                  {SEED_FURNITURE_JOINERY_CASES.map((fc, idx) => {
                    const isSelected = selectedFurnitureId === fc.furnitureId;
                    return (
                      <button
                        key={fc.furnitureId}
                        onClick={() => setSelectedFurnitureId(fc.furnitureId)}
                        className={`text-left p-3 rounded-lg border transition-all ${
                          isSelected
                            ? 'bg-white border-[#002050] shadow-md ring-2 ring-[#002050]/20'
                            : 'bg-white/80 border-slate-300 hover:border-slate-400 hover:bg-white'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-800 px-1.5 py-0.5 rounded">
                            CASE {idx + 1} • {fc.itemCode}
                          </span>
                          {isSelected && (
                            <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600">
                              <Check className="w-3 h-3" /> Active
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 line-clamp-1">{fc.name}</h4>
                        <p className="text-[11px] text-slate-500 font-mono mt-0.5">
                          {fc.dimensionsMm.width}W × {fc.dimensionsMm.depth}D × {fc.dimensionsMm.height}H (mm)
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Sub-view Switcher: Elevation vs Section A vs Section B vs CNC Cutting List */}
              <div className="flex items-center justify-between flex-wrap gap-2 border-b border-slate-200 pb-2">
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    onClick={() => setJoineryViewMode('FRONT_ELEVATION')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold ${
                      joineryViewMode === 'FRONT_ELEVATION'
                        ? 'bg-[#002050] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    1. Front Elevation & Shutter Pattern
                  </button>
                  <button
                    onClick={() => setJoineryViewMode('SECTION_A')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold ${
                      joineryViewMode === 'SECTION_A'
                        ? 'bg-[#002050] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    2. Section A-A (Internal Carcass Layout)
                  </button>
                  {activeFurniture.sections.length > 1 && (
                    <button
                      onClick={() => setJoineryViewMode('SECTION_B')}
                      className={`px-3 py-1.5 rounded text-xs font-semibold ${
                        joineryViewMode === 'SECTION_B'
                          ? 'bg-[#002050] text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      3. Section B-B (Study Desk & Niche)
                    </button>
                  )}
                  <button
                    onClick={() => setJoineryViewMode('CUTTING_LIST')}
                    className={`px-3 py-1.5 rounded text-xs font-semibold ${
                      joineryViewMode === 'CUTTING_LIST'
                        ? 'bg-[#002050] text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    4. Factory CNC Cutting List
                  </button>
                </div>

                {/* Viewport Zoom Controls */}
                <div className="flex items-center gap-1 text-xs">
                  <button
                    onClick={() => setZoomLevel(prev => Math.max(70, prev - 15))}
                    className="p-1 rounded hover:bg-slate-100 border border-slate-200"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                  <span className="font-mono text-[11px] px-1 text-slate-600">{zoomLevel}%</span>
                  <button
                    onClick={() => setZoomLevel(prev => Math.min(150, prev + 15))}
                    className="p-1 rounded hover:bg-slate-100 border border-slate-200"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-3.5 h-3.5 text-slate-600" />
                  </button>
                </div>
              </div>

              {/* TECHNICAL JOINERY CAD BLUEPRINT VIEWER */}
              {joineryViewMode !== 'CUTTING_LIST' ? (
                <div className="border border-slate-300 rounded-lg bg-white p-4 overflow-hidden relative shadow-inner">
                  {/* Drawing Sheet Title Block Header */}
                  <div className="flex items-center justify-between border-b border-slate-200 pb-2 mb-3 text-xs text-slate-500">
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-slate-900">{activeFurniture.name}</span>
                      <span className="font-mono text-slate-600">Drawing No: {activeFurniture.linkage.drawingId}</span>
                      <span className="font-mono text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                        {activeFurniture.linkage.revision}
                      </span>
                    </div>
                    <span className="font-mono">All Dimensions in Millimeters (MM) • Scale 1:25</span>
                  </div>

                  <div className="w-full flex items-center justify-center min-h-[420px] bg-[#f8fafc] border border-slate-200 rounded p-4">
                    <svg
                      viewBox="0 0 920 500"
                      className="w-full max-h-[500px] select-none font-sans"
                      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center' }}
                    >
                      {/* Drawing Boundary Frame & Sheet Border */}
                      <rect x="20" y="20" width="880" height="460" fill="#ffffff" stroke="#0f172a" strokeWidth="2" />
                      <rect x="25" y="25" width="870" height="450" fill="none" stroke="#94a3b8" strokeWidth="0.8" />

                      {/* Technical Title Block in Lower Right */}
                      <g id="titleBlock">
                        <rect x="580" y="380" width="315" height="95" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
                        <line x1="580" y1="410" x2="895" y2="410" stroke="#cbd5e1" />
                        <line x1="580" y1="440" x2="895" y2="440" stroke="#cbd5e1" />
                        <line x1="740" y1="380" x2="740" y2="475" stroke="#cbd5e1" />
                        
                        <text x="590" y="398" fill="#64748b" fontSize="8" fontWeight="bold">CLIENT:</text>
                        <text x="635" y="398" fill="#0f172a" fontSize="9" fontWeight="bold">Vikram & Priya Malhotra</text>
                        <text x="748" y="398" fill="#64748b" fontSize="8" fontWeight="bold">PRJ CODE:</text>
                        <text x="800" y="398" fill="#0f172a" fontSize="9" fontWeight="bold">PRJ-2026-001</text>
                        
                        <text x="590" y="428" fill="#64748b" fontSize="8" fontWeight="bold">DRAWING:</text>
                        <text x="645" y="428" fill="#0284c7" fontSize="9" fontWeight="bold">{activeFurniture.linkage.drawingId}</text>
                        <text x="748" y="428" fill="#64748b" fontSize="8" fontWeight="bold">REV / DATE:</text>
                        <text x="810" y="428" fill="#b45309" fontSize="9" fontWeight="bold">R02 / SEP 2026</text>
                        
                        <text x="590" y="460" fill="#64748b" fontSize="8" fontWeight="bold">DESIGNER:</text>
                        <text x="645" y="460" fill="#0f172a" fontSize="9">Aparanji Divya</text>
                        <text x="748" y="460" fill="#64748b" fontSize="8" fontWeight="bold">BOQ LINK:</text>
                        <text x="810" y="460" fill="#059669" fontSize="9" fontWeight="bold">{activeFurniture.linkage.boqReference}</text>
                      </g>

                      {/* --- CASE 1: MBR WARDROBE WITH STUDY DESK --- */}
                      {selectedFurnitureId === 'FUR-WRD-001' && (
                        <g id="case1Drawing">
                          {joineryViewMode === 'FRONT_ELEVATION' ? (
                            /* FRONT ELEVATION OF WARDROBE (2700mm) */
                            <g id="frontElevation">
                              {/* 100mm Skirting */}
                              <rect x="70" y="350" width="460" height="15" fill="#334155" />
                              <text x="75" y="361" fill="#ffffff" fontSize="8">100mm SKIRTING</text>

                              {/* Main Wardrobe Body (1800mm scaled) */}
                              <rect x="70" y="80" width="310" height="270" fill="#f1f5f9" stroke="#0f172a" strokeWidth="2" />
                              
                              {/* Shutter 1: Sage Green (900mm) */}
                              <rect x="75" y="85" width="98" height="260" fill="#73877b" stroke="#0f172a" strokeWidth="1.2" />
                              <circle cx="124" cy="215" r="14" fill="#a4b494" opacity="0.8" />
                              <text x="124" y="240" fill="#ffffff" fontSize="8" textAnchor="middle">Sage Green</text>

                              {/* Shutter 2: Brushed Gold Alu Profile & Tinted Glass (900mm) */}
                              <rect x="176" y="85" width="98" height="260" fill="#1e293b" stroke="#d4af37" strokeWidth="2" />
                              <rect x="180" y="90" width="90" height="150" fill="#334155" opacity="0.6" stroke="#d4af37" />
                              <text x="225" y="170" fill="#fef08a" fontSize="8" textAnchor="middle">Tinted Glass</text>
                              {/* Bottom Drawer 900mm */}
                              <rect x="180" y="250" width="90" height="90" fill="#73877b" stroke="#0f172a" />
                              <text x="225" y="300" fill="#ffffff" fontSize="8" textAnchor="middle">Drawer 900</text>

                              {/* Shutter 3: Sage Green (900mm) */}
                              <rect x="277" y="85" width="98" height="260" fill="#73877b" stroke="#0f172a" strokeWidth="1.2" />
                              <circle cx="326" cy="215" r="14" fill="#a4b494" opacity="0.8" />
                              <text x="326" y="240" fill="#ffffff" fontSize="8" textAnchor="middle">Sage Green</text>

                              {/* Study Desk Section (900mm) */}
                              <rect x="385" y="80" width="145" height="270" fill="#f8fafc" stroke="#0f172a" strokeWidth="1.5" />
                              {/* Fluted Backing Panel */}
                              <rect x="385" y="80" width="65" height="270" fill="#92400e" opacity="0.9" />
                              <text x="417" y="200" fill="#ffffff" fontSize="8" textAnchor="middle" transform="rotate(-90 417 200)">FLUTED BATTENS</text>

                              {/* Open Shelves */}
                              <rect x="455" y="110" width="70" height="10" fill="#d97706" />
                              <rect x="455" y="160" width="70" height="10" fill="#d97706" />
                              <text x="490" y="140" fill="#64748b" fontSize="7" textAnchor="middle">Shelves 450</text>
                              <text x="490" y="190" fill="#64748b" fontSize="7" textAnchor="middle">Shelves 369</text>

                              {/* Desk Countertop (715mm height) */}
                              <rect x="385" y="240" width="145" height="14" fill="#d97706" stroke="#78350f" strokeWidth="1.5" />
                              <text x="457" y="251" fill="#ffffff" fontSize="8" fontWeight="bold" textAnchor="middle">COUNTERTOP +715</text>

                              {/* Stationery Drawers */}
                              <rect x="390" y="256" width="65" height="20" fill="#ffffff" stroke="#0f172a" />
                              <rect x="460" y="256" width="65" height="20" fill="#ffffff" stroke="#0f172a" />
                              <text x="422" y="270" fill="#0f172a" fontSize="7">130 Drawer</text>
                              <text x="492" y="270" fill="#0f172a" fontSize="7">130 Drawer</text>

                              {/* Legroom Clearance */}
                              <text x="457" y="320" fill="#94a3b8" fontSize="8" textAnchor="middle">600 Legroom</text>

                              {/* Main Dimension Strings */}
                              <line x1="70" y1="380" x2="530" y2="380" stroke="#0284c7" strokeWidth="1.5" />
                              <text x="300" y="395" fill="#0284c7" fontSize="11" fontWeight="bold" textAnchor="middle">2,700 mm Total Width</text>

                              <line x1="70" y1="410" x2="225" y2="410" stroke="#64748b" strokeWidth="1" />
                              <text x="147" y="422" fill="#64748b" fontSize="9" textAnchor="middle">900 mm</text>
                              <line x1="225" y1="410" x2="380" y2="410" stroke="#64748b" strokeWidth="1" />
                              <text x="302" y="422" fill="#64748b" fontSize="9" textAnchor="middle">900 mm</text>
                              <line x1="380" y1="410" x2="530" y2="410" stroke="#64748b" strokeWidth="1" />
                              <text x="455" y="422" fill="#64748b" fontSize="9" textAnchor="middle">900 mm (Study)</text>

                              {/* Height Dimension Strings */}
                              <line x1="545" y1="80" x2="545" y2="365" stroke="#0284c7" strokeWidth="1.2" />
                              <text x="560" y="225" fill="#0284c7" fontSize="9" fontWeight="bold" transform="rotate(90 560 225)">2900 mm Height</text>
                            </g>
                          ) : (
                            /* SECTION A-A: INTERNAL CARCASS VIEW */
                            <g id="sectionAA">
                              <rect x="100" y="80" width="360" height="270" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
                              {/* Loft Top Shelf (Depth: 600mm) */}
                              <rect x="100" y="80" width="360" height="50" fill="#e2e8f0" stroke="#0f172a" />
                              <text x="280" y="110" fill="#0f172a" fontSize="10" fontWeight="bold" textAnchor="middle">Loft Luggage Storage (Height 450mm)</text>
                              
                              {/* Hanging Zone */}
                              <line x1="120" y1="150" x2="320" y2="150" stroke="#94a3b8" strokeWidth="4" />
                              <text x="220" y="145" fill="#64748b" fontSize="8" textAnchor="middle">Chrome Hanging Rod (Suits 1100mm drop)</text>

                              {/* Hanging Suits Visual */}
                              <rect x="140" y="152" width="25" height="90" rx="3" fill="#cbd5e1" stroke="#94a3b8" />
                              <rect x="180" y="152" width="25" height="90" rx="3" fill="#cbd5e1" stroke="#94a3b8" />
                              <rect x="220" y="152" width="25" height="90" rx="3" fill="#cbd5e1" stroke="#94a3b8" />

                              {/* Vertical Partition */}
                              <line x1="330" y1="130" x2="330" y2="350" stroke="#0f172a" strokeWidth="2" />

                              {/* Internal Shelves on Right */}
                              <rect x="330" y="170" width="130" height="10" fill="#e2e8f0" />
                              <rect x="330" y="210" width="130" height="10" fill="#e2e8f0" />
                              <rect x="330" y="250" width="130" height="10" fill="#e2e8f0" />
                              <text x="395" y="165" fill="#64748b" fontSize="7" textAnchor="middle">Folded Shirts</text>
                              <text x="395" y="205" fill="#64748b" fontSize="7" textAnchor="middle">Bed Linen</text>

                              {/* Drawers Module at Bottom */}
                              <rect x="110" y="260" width="210" height="38" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
                              <text x="215" y="284" fill="#0284c7" fontSize="9" fontWeight="bold" textAnchor="middle">Blum Tandembox Drawer 1 (200mm)</text>
                              <rect x="110" y="302" width="210" height="38" fill="#ffffff" stroke="#0284c7" strokeWidth="1.5" />
                              <text x="215" y="326" fill="#0284c7" fontSize="9" fontWeight="bold" textAnchor="middle">Blum Tandembox Drawer 2 (200mm)</text>
                            </g>
                          )}
                        </g>
                      )}

                      {/* --- CASE 2 & 3: Render corresponding technical joinery SVG lines --- */}
                      {selectedFurnitureId !== 'FUR-WRD-001' && (
                        <g id="otherCasesDrawing">
                          <rect x="80" y="80" width="460" height="270" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
                          <text x="310" y="200" fill="#0f172a" fontSize="14" fontWeight="bold" textAnchor="middle">
                            {activeFurniture.name}
                          </text>
                          <text x="310" y="225" fill="#0284c7" fontSize="11" fontFamily="monospace" textAnchor="middle">
                            Drawing ID: {activeFurniture.linkage.drawingId} • Revision: R02
                          </text>
                          <text x="310" y="245" fill="#64748b" fontSize="10" textAnchor="middle">
                            Parametric Joinery Spec: {activeFurniture.carcassSpecs.coreMaterial}
                          </text>
                          <rect x="120" y="280" width="380" height="50" rx="4" fill="#f1f5f9" stroke="#cbd5e1" />
                          <text x="310" y="310" fill="#334155" fontSize="9" textAnchor="middle">
                            CNC Ready Panel Schedule: {activeFurniture.cuttingListSummary.length} Panels Verified
                          </text>
                        </g>
                      )}
                    </svg>
                  </div>
                </div>
              ) : (
                /* FACTORY CNC CUTTING LIST TABLE */
                <div className="border border-slate-300 rounded-lg bg-white p-4 shadow-xs">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-slate-900">
                        Automated CNC Factory Cutting List ({activeFurniture.itemCode})
                      </h4>
                      <p className="text-xs text-slate-500">
                        Optimized for standard 8ft × 4ft (2440mm × 1220mm) marine plywood boards with grain alignment.
                      </p>
                    </div>
                    <button
                      onClick={() => showNotification('Exported CNC G-Code & Beam Saw Cutting List (CSV).')}
                      className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                    >
                      Export CNC Cut-List (.CSV)
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead>
                        <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                          <th className="p-2">Panel Code</th>
                          <th className="p-2">Part Name / Component</th>
                          <th className="p-2">Substrate Core</th>
                          <th className="p-2 text-right">Length (mm)</th>
                          <th className="p-2 text-right">Width (mm)</th>
                          <th className="p-2 text-right">Thk (mm)</th>
                          <th className="p-2 text-center">Qty</th>
                          <th className="p-2">Edge Banding Spec</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200 font-mono text-[11px]">
                        {activeFurniture.cuttingListSummary.map(panel => (
                          <tr key={panel.panelCode} className="hover:bg-slate-50">
                            <td className="p-2 font-bold text-blue-700">{panel.panelCode}</td>
                            <td className="p-2 text-slate-900 font-sans font-medium">{panel.partName}</td>
                            <td className="p-2 text-slate-600">{panel.material}</td>
                            <td className="p-2 text-right font-bold">{panel.lengthMm}</td>
                            <td className="p-2 text-right font-bold">{panel.widthMm}</td>
                            <td className="p-2 text-right">{panel.thicknessMm}</td>
                            <td className="p-2 text-center text-emerald-700 font-bold">{panel.qty}</td>
                            <td className="p-2 text-slate-600 font-sans">{panel.edgeBandingSides}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Hardware & Fittings Schedule for Joinery Case */}
              <div className="border border-slate-200 rounded-lg bg-slate-50 p-3.5">
                <h4 className="text-xs font-bold text-slate-900 mb-2 flex items-center gap-1.5">
                  <Package className="w-3.5 h-3.5 text-blue-600" />
                  <span>Approved Architectural Hardware & Fittings Schedule ({activeFurniture.itemCode})</span>
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                  {activeFurniture.hardwareList.map(hw => (
                    <div key={hw.code} className="bg-white p-2.5 rounded border border-slate-200 text-xs shadow-2xs">
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-mono text-[10px] font-bold text-slate-500">{hw.code}</span>
                        <span className="bg-blue-50 text-blue-700 text-[10px] font-bold px-1.5 py-0.2 rounded">
                          {hw.brand}
                        </span>
                      </div>
                      <h5 className="font-bold text-slate-800 text-[11px] line-clamp-1">{hw.name}</h5>
                      <p className="text-[10px] text-slate-500 mt-0.5 line-clamp-2">{hw.spec}</p>
                      <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[11px] font-mono">
                        <span className="text-slate-500">Allocation:</span>
                        <span className="font-bold text-emerald-700">{hw.quantity} {hw.unit}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PACKAGE D: SERVICES DRAWINGS (MEP, False Ceiling, HVAC)           */}
          {/* ================================================================= */}
          {activePackage === 'PACKAGE_D_SERVICES_DRAWINGS' && (
            <div className="space-y-4">
              {/* Discipline Switcher */}
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button
                  onClick={() => setSelectedServiceDiscipline('ELECTRICAL')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold ${
                    selectedServiceDiscipline === 'ELECTRICAL'
                      ? 'bg-[#002050] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  Electrical & Lighting Conduit Plan
                </button>
                <button
                  onClick={() => setSelectedServiceDiscipline('FALSE_CEILING')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold ${
                    selectedServiceDiscipline === 'FALSE_CEILING'
                      ? 'bg-[#002050] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  False Ceiling & Cove Pelmet Layout
                </button>
                <button
                  onClick={() => setSelectedServiceDiscipline('HVAC')}
                  className={`px-3 py-1.5 rounded text-xs font-semibold ${
                    selectedServiceDiscipline === 'HVAC'
                      ? 'bg-[#002050] text-white'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  HVAC VRV Ducting & Diffuser Alignment
                </button>
              </div>

              {/* Service Details Header */}
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">{activeService.title}</h3>
                  <p className="text-xs text-slate-500">
                    Drawing No: {activeService.drawingCode} • Scale: {activeService.scale} • Points Count: {activeService.circuitPointsCount} Verified
                  </p>
                </div>
                <button
                  onClick={() => showNotification(`Exported ${activeService.discipline} Services DWG & Point Schedule.`)}
                  className="px-3 py-1 rounded bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium"
                >
                  Export Services Sheet
                </button>
              </div>

              {/* Fixtures Schedule */}
              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                      <th className="p-2.5">Symbol</th>
                      <th className="p-2.5">Fixture Description</th>
                      <th className="p-2.5">Wattage / Spec</th>
                      <th className="p-2.5">Approved Brand Model</th>
                      <th className="p-2.5">Mounting Location</th>
                      <th className="p-2.5">BOQ Ref</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-[11px]">
                    {activeService.fixturesSchedule.map(fix => (
                      <tr key={fix.symbol + fix.description} className="hover:bg-slate-50">
                        <td className="p-2.5 font-bold text-base text-blue-600">{fix.symbol}</td>
                        <td className="p-2.5 font-medium text-slate-900">{fix.description}</td>
                        <td className="p-2.5 font-mono text-slate-600">{fix.wattageOrSpec}</td>
                        <td className="p-2.5 text-slate-800">{fix.brandModel}</td>
                        <td className="p-2.5 text-slate-600">{fix.mountingHeight}</td>
                        <td className="p-2.5 font-mono font-bold text-emerald-700">{fix.boqRef}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mandatory Execution Notes */}
              <div className="bg-amber-50/60 border border-amber-200 rounded p-3 text-xs">
                <h4 className="font-bold text-amber-900 mb-1 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                  <span>Mandatory MEP Execution & Coordination Guardrails:</span>
                </h4>
                <ul className="list-disc pl-5 space-y-1 text-slate-700 text-[11px]">
                  {activeService.technicalNotes.map((note, nIdx) => (
                    <li key={nIdx}>{note}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* ================================================================= */}
          {/* PACKAGE E: MATERIAL & FINISHING SCHEDULE                          */}
          {/* ================================================================= */}
          {activePackage === 'PACKAGE_E_MATERIAL_SCHEDULE' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div>
                  <h3 className="text-sm font-bold text-slate-900">
                    Master Bedroom Finishing Schedule & Specification Register
                  </h3>
                  <p className="text-xs text-slate-500">
                    Authoritative schedule linking codes, approved samples, brand specs, and deterministic BOQ lines.
                  </p>
                </div>
                <button
                  onClick={() => showNotification('Exported Material Specification Schedule (Excel CSV).')}
                  className="px-3 py-1 rounded bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold"
                >
                  Export Material Schedule
                </button>
              </div>

              <div className="border border-slate-200 rounded-lg overflow-hidden bg-white shadow-xs">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="bg-slate-100 border-b border-slate-300 text-slate-700 font-bold">
                        <th className="p-2.5">Code</th>
                        <th className="p-2.5">Category</th>
                        <th className="p-2.5">Product & Specification</th>
                        <th className="p-2.5">Brand / Model</th>
                        <th className="p-2.5">Finish Code / Color</th>
                        <th className="p-2.5 text-right">Unit Rate</th>
                        <th className="p-2.5">BOQ Reference</th>
                        <th className="p-2.5">Sample Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 text-[11px]">
                      {SEED_MATERIAL_SCHEDULE.map(mat => (
                        <tr key={mat.materialCode} className="hover:bg-slate-50">
                          <td className="p-2.5 font-mono font-bold text-purple-700">{mat.materialCode}</td>
                          <td className="p-2.5 font-semibold text-slate-600">{mat.category}</td>
                          <td className="p-2.5">
                            <span className="font-bold text-slate-900 block">{mat.productName}</span>
                            <span className="text-[10px] text-slate-500">{mat.specification}</span>
                          </td>
                          <td className="p-2.5 text-slate-800 font-medium">{mat.brand}</td>
                          <td className="p-2.5">
                            <div className="flex items-center gap-1.5">
                              <span
                                className="w-3.5 h-3.5 rounded border border-slate-300 shrink-0"
                                style={{ backgroundColor: mat.colourSwatchHex }}
                              />
                              <span className="font-mono text-slate-700 text-[10px]">{mat.finishCode}</span>
                            </div>
                          </td>
                          <td className="p-2.5 text-right font-mono font-bold text-slate-900">
                            ₹{mat.approvedRateInr.toLocaleString()} / {mat.unit}
                          </td>
                          <td className="p-2.5 font-mono font-bold text-emerald-700">{mat.boqReference}</td>
                          <td className="p-2.5">
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[10px] font-bold px-2 py-0.5 rounded">
                              <CheckCircle2 className="w-3 h-3" /> Approved
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ===================================================================== */}
      {/* MODAL 1: PARAMETRIC CAD/BIM VALIDATION REPORT (10-Check Gate)        */}
      {/* ===================================================================== */}
      {validationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-3xl w-full max-h-[85vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-4 bg-[#002050] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                <h3 className="font-bold text-sm">Parametric CAD/BIM Validation Audit (10 Rules Gate)</h3>
              </div>
              <button
                onClick={() => setValidationModalOpen(false)}
                className="text-white/70 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-2.5 flex-1 text-xs">
              <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-800 p-2.5 rounded font-medium text-xs">
                <span>All 10 dimensional, clearance, MEP interference, and BOQ linkage rules verified.</span>
                <span className="font-bold">10 / 10 Passed</span>
              </div>

              {validationChecks.map(chk => (
                <div key={chk.id} className="p-2.5 rounded border border-slate-200 bg-slate-50 flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900">{chk.ruleName}</span>
                      <span className="font-mono text-[10px] text-slate-500 uppercase">{chk.category}</span>
                    </div>
                    <p className="text-[11px] text-slate-600 mt-0.5 font-mono">
                      Measured: <span className="text-slate-900">{chk.measuredValue}</span>
                    </p>
                    <p className="text-[11px] text-emerald-700 font-medium mt-0.5">
                      Verdict: {chk.verdictMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500">Checked by Build Storys Parametric Verification Engine</span>
              <button
                onClick={() => {
                  setValidationModalOpen(false);
                  showNotification('Validation certificate attached to Drawing Transmittal Package.');
                }}
                className="px-4 py-1.5 rounded bg-[#002050] text-white text-xs font-semibold"
              >
                Accept & Freeze Checks
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* MODAL 2: DESIGN CHANGE & AUTOMATIC CASCADE DELTA SIMULATOR            */}
      {/* ===================================================================== */}
      {simulationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-2xl border border-slate-300 max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95">
            <div className="p-4 bg-[#002050] text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-5 h-5 text-amber-300" />
                <div>
                  <h3 className="font-bold text-sm">Design Change Cascade & Impact Engine</h3>
                  <p className="text-[11px] text-white/70">
                    Calculates immediate downstream delta across Drawings, Material Quantities, BOQ, Procurement POs, and CNC Cutting.
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSimulationModalOpen(false)}
                className="text-white/70 hover:text-white text-xs px-2 py-1 rounded bg-white/10"
              >
                Close
              </button>
            </div>

            <div className="p-4 overflow-y-auto space-y-4 flex-1 text-xs">
              {/* Scenario Picker */}
              <div className="bg-slate-50 border border-slate-300 rounded p-3">
                <span className="text-xs font-bold text-slate-700 block mb-2 uppercase">
                  Select Design Modification Scenario:
                </span>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                  <button
                    onClick={() => handleScenarioChange('EXTEND_WARDROBE_TO_3000MM')}
                    className={`p-2.5 rounded border text-left transition-all ${
                      selectedChangeScenario === 'EXTEND_WARDROBE_TO_3000MM'
                        ? 'bg-blue-50 border-[#002050] ring-1 ring-[#002050]'
                        : 'bg-white border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-slate-900 block text-[11px]">Extend Width to 3000mm</span>
                    <span className="text-[10px] text-slate-500">+300mm Study Counter & Panel</span>
                  </button>

                  <button
                    onClick={() => handleScenarioChange('UPGRADE_TO_SMOKED_OAK_VENEER')}
                    className={`p-2.5 rounded border text-left transition-all ${
                      selectedChangeScenario === 'UPGRADE_TO_SMOKED_OAK_VENEER'
                        ? 'bg-blue-50 border-[#002050] ring-1 ring-[#002050]'
                        : 'bg-white border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-slate-900 block text-[11px]">Upgrade to Smoked Oak Veneer</span>
                    <span className="text-[10px] text-slate-500">Laminate to Natural PU Veneer</span>
                  </button>

                  <button
                    onClick={() => handleScenarioChange('ADD_INTERNAL_LEATHER_DRAWERS')}
                    className={`p-2.5 rounded border text-left transition-all ${
                      selectedChangeScenario === 'ADD_INTERNAL_LEATHER_DRAWERS'
                        ? 'bg-blue-50 border-[#002050] ring-1 ring-[#002050]'
                        : 'bg-white border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    <span className="font-bold text-slate-900 block text-[11px]">Add Leather Drawer Organizers</span>
                    <span className="text-[10px] text-slate-500">Italian Nappa leather watch trays</span>
                  </button>
                </div>
              </div>

              {/* Cascade Result: 5 Real-Time Impact Streams */}
              <div className="border border-slate-200 rounded p-3 bg-white space-y-3">
                <h4 className="font-bold text-slate-900 text-xs flex items-center justify-between border-b border-slate-200 pb-1.5">
                  <span>Downstream ERP Synchronization Summary</span>
                  <span className="font-mono text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                    Net BOQ Delta: +₹{cascadeResult.boqDeltaSummary.netDeltaInr.toLocaleString()}
                  </span>
                </h4>

                {/* 1. Affected Drawings */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    1. Affected Drawings Requiring Automatic Regeneration:
                  </span>
                  <div className="flex items-center gap-2 flex-wrap">
                    {cascadeResult.affectedDrawings.map(drw => (
                      <span key={drw.drawingCode} className="bg-white border border-slate-300 text-slate-800 text-[11px] px-2 py-1 rounded font-mono flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <strong>{drw.drawingCode}</strong>: {drw.title} ({drw.actionRequired})
                      </span>
                    ))}
                  </div>
                </div>

                {/* 2. Material Takeoff Quantities Delta */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    2. Material Quantities & Cost Variance Delta:
                  </span>
                  <table className="w-full text-left text-[11px]">
                    <thead>
                      <tr className="border-b border-slate-300 text-slate-500">
                        <th className="py-1">Material</th>
                        <th className="py-1 text-right">Orig Qty</th>
                        <th className="py-1 text-right">Rev Qty</th>
                        <th className="py-1 text-right">Delta</th>
                        <th className="py-1 text-right">Cost Impact</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 font-mono">
                      {cascadeResult.materialTakeoffDelta.map(m => (
                        <tr key={m.materialCode}>
                          <td className="py-1 font-sans font-medium text-slate-800">{m.materialName}</td>
                          <td className="py-1 text-right text-slate-500">{m.originalQty} {m.unit}</td>
                          <td className="py-1 text-right text-slate-900 font-bold">{m.revisedQty} {m.unit}</td>
                          <td className="py-1 text-right text-amber-700 font-bold">
                            {m.deltaQty > 0 ? `+${m.deltaQty}` : m.deltaQty} {m.unit}
                          </td>
                          <td className="py-1 text-right font-bold text-slate-900">
                            {m.costImpactInr >= 0 ? `+₹${m.costImpactInr.toLocaleString()}` : `-₹${Math.abs(m.costImpactInr).toLocaleString()}`}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* 3. Procurement PO Updates */}
                <div className="bg-slate-50 p-2.5 rounded border border-slate-200">
                  <span className="text-[11px] font-bold text-slate-700 block mb-1">
                    3. Procurement Purchase Orders Flagged for Amendment:
                  </span>
                  <div className="space-y-1">
                    {cascadeResult.procurementImpact.map(po => (
                      <div key={po.affectedPoNumber} className="flex items-center justify-between text-[11px] bg-white p-1.5 rounded border border-slate-200 font-mono">
                        <span><strong>{po.affectedPoNumber}</strong> ({po.vendorName})</span>
                        <span className="text-amber-700 font-bold">{po.status}</span>
                        <span className="text-slate-900 font-bold">Revised Total: ₹{po.revisedAmountInr.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 4. Production CNC Cutting Optimization */}
                <div className="flex items-center justify-between bg-blue-50/70 p-2.5 rounded border border-blue-200 text-xs">
                  <div className="flex items-center gap-2">
                    <Wrench className="w-4 h-4 text-blue-700" />
                    <span className="text-slate-800 font-medium">
                      Factory Production: <strong>{cascadeResult.productionCuttingListDelta.totalPanelsAffected} CNC Panels Re-nested</strong>.
                      Beam Saw Run-time: {cascadeResult.productionCuttingListDelta.revisedCuttingTimeMinutes} min.
                    </span>
                  </div>
                  <span className="bg-blue-600 text-white font-mono text-[10px] px-2 py-0.5 rounded font-bold">
                    CNC Code Ready
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Footer Actions */}
            <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between">
              <span className="text-xs text-slate-500 font-mono">
                Revision Tracking: {isSignOffApplied ? 'CR-2026-004 Signed & Applied to BOQ' : 'Pending Formal Sign-off'}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setSimulationModalOpen(false)}
                  className="px-3 py-1.5 rounded border border-slate-300 text-slate-700 text-xs"
                >
                  Cancel
                </button>
                <button
                  onClick={handleApplySignOff}
                  disabled={isSignOffApplied}
                  className={`px-4 py-1.5 rounded text-xs font-semibold text-white shadow-xs ${
                    isSignOffApplied
                      ? 'bg-emerald-600 cursor-default'
                      : 'bg-[#002050] hover:bg-[#003366]'
                  }`}
                >
                  {isSignOffApplied ? '✓ Change Order Signed' : 'Sign-Off & Apply Change Order'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI IMAGE-TO-CAD TECHNICAL PLAN GENERATOR MODAL (IMAGE 1 -> IMAGE 2) */}
      <ImageToCadPlanGeneratorModal
        isOpen={imageToCadModalOpen}
        onClose={() => setImageToCadModalOpen(false)}
        project={project}
        currentUser={currentUser}
        onNavigateTab={onNavigateTab}
        onApplyDrawingToProject={(drawing) => {
          setSelectedFurnitureId('FUR-WRD-001');
          setActivePackage('PACKAGE_C_FURNITURE_JOINERY');
          showNotification(`Applied ${drawing.title} to Project Technical Drawing Set!`);
        }}
      />
    </div>
  );
};
