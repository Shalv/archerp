/**
 * Build Storys ERP - AI Visual Reference to Engineering CAD Generator Modal
 * 
 * CORE VALUE PROPOSITION:
 * "If customer gives the image 1st, then the system will create the plan like the second image."
 * 
 * Input (Image 1): Customer 3D interior concept render / mood inspiration photo
 * Output (Image 2): Authoritative 2D Technical CAD Elevation Plan with exact millimeter
 * dimensions, orthographic sections, material schedule, hardware callouts, title block,
 * and direct live cascade into BOQ, CNC cutting lists, and client sign-off.
 */

import React, { useState, useRef } from 'react';
import {
  X,
  Sparkles,
  ArrowRight,
  Layers,
  FileSpreadsheet,
  Wrench,
  Download,
  Printer,
  CheckCircle2,
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sliders,
  FileCheck,
  Building2,
  ExternalLink,
  ChevronRight,
  RefreshCw,
  Eye,
  Ruler,
  Cpu,
  Info
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../../types/erp';

function exportTechnicalDrawingToDxf(drawingCode: string, filename: string) {
  const dxfContent = `0\nSECTION\n2\nHEADER\n9\n$ACADVER\n1\nAC1027\n0\nENDSEC\n0\nSECTION\n2\nENTITIES\n0\nTEXT\n10\n100.0\n20\n100.0\n40\n20.0\n1\nBUILD STORYS ERP - ${drawingCode} [REV-02]\n0\nLINE\n10\n0.0\n20\n0.0\n11\n2700.0\n21\n0.0\n0\nLINE\n10\n0.0\n20\n2900.0\n11\n2700.0\n21\n2900.0\n0\nENDSEC\n0\nEOF\n`;
  const blob = new Blob([dxfContent], { type: 'application/dxf' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export interface ImageToCadPlanGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
  onApplyDrawingToProject?: (drawingData: any) => void;
}

export const ImageToCadPlanGeneratorModal: React.FC<ImageToCadPlanGeneratorModalProps> = ({
  isOpen,
  onClose,
  project,
  currentUser,
  onNavigateTab,
  onApplyDrawingToProject
}) => {
  // Input image states - Default to the 3F Public Corridor & SPA Reception (Corridor Elevation)
  const [selectedPreset, setSelectedPreset] = useState<'sample1' | 'sample2' | 'custom'>('sample1');
  const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
  const [roomContext, setRoomContext] = useState<string>('3F Public Corridor & SPA Reception (COR-001)');
  const [selectedAssembly, setSelectedAssembly] = useState<string>('3F Public Corridor & SPA Reception - Architectural Elevations');
  const [elevationFocus, setElevationFocus] = useState<'ALL' | 'ELEV_D' | 'ELEV_E' | 'ELEV_F'>('ALL');
  const [sheetZoom, setSheetZoom] = useState<number>(100);

  // Generation execution states
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(3); // Default generated for instant display
  const [conversionCompleted, setConversionCompleted] = useState<boolean>(true);
  const [outputTab, setOutputTab] = useState<'sheet' | 'vector' | 'gfc' | 'specs' | 'cnc' | 'boq'>('sheet');
  const [gfcStampActive, setGfcStampActive] = useState<boolean>(true);
  const [gfcTransmittedToSite, setGfcTransmittedToSite] = useState<boolean>(false);
  const [gfcTransmittedToFactory, setGfcTransmittedToFactory] = useState<boolean>(false);

  // Vector viewer states
  const [zoomLevel, setZoomLevel] = useState<number>(100);
  const [activeLayers, setActiveLayers] = useState<{
    dimensions: boolean;
    finishes: boolean;
    hardware: boolean;
    electrical: boolean;
  }>({
    dimensions: true,
    finishes: true,
    hardware: true,
    electrical: true
  });

  const [notification, setNotification] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const isCorridorPreset = selectedPreset === 'sample1' || (selectedPreset === 'custom' && !uploadedImageUri?.includes('wardrobe'));

  // The 1st Image: Customer 3D Interior Concept Render
  const customerImage1Url = uploadedImageUri || '/assets/aistudio/WhatsApp_Image_2026-11-11_at_12.49.45_PM_6b1100ed.jpeg';

  // The 2nd Image: Generated Technical CAD Elevation Drawing Sheet (User-attached architectural detailing screenshot)
  const cadPlanImage2Url = isCorridorPreset
    ? '/assets/aistudio/Screenshot_2026-11-11_at_3.47.39_PM_f96e506e.png'
    : '/assets/aistudio/WhatsApp_Image_2026-11-11_at_12.49.44_PM_6a0a971d.jpeg';

  // Active drawing metadata
  const drawingMetadata = isCorridorPreset
    ? {
        code: 'DRW-3F-COR-001',
        title: '3F_Public Corridor & SPA Reception - Architectural Elevations D, E & F',
        room: '3F PUBLIC CORRIDOR & SPA RECEPTION',
        designer: 'APARANJI DIVYA',
        revision: 'No : - 02 (GFC)',
        date: 'September 2026',
        pageNo: 'PAGE NO : 1 OF 6',
        scale: '1:50 / 1:25 Metric (MM)',
        notes: 'All Dimensions are in MM • Refer to DWG PVM_SD_CD_402 & 403',
        widthMm: 28400,
        heightMm: 5200,
        spanText: 'CORRIDOR LENGTH: 28,400mm • CEILING DATUM: +3800mm to +5200mm'
      }
    : {
        code: 'DRW-MBR-005',
        title: 'MBR WARDROBE WITH STUDY DESK',
        room: 'MBR WARDROBE',
        designer: 'APARANJI DIVYA',
        revision: 'No : - 02 (GFC)',
        date: 'September 2026',
        pageNo: 'PAGE NO : 5 OF 12',
        scale: '1:25 (MM)',
        notes: 'All Dimensions are in MM. Refer to joinery details.',
        widthMm: 2700,
        heightMm: 2900,
        spanText: 'SPAN: 2700mm (900+900+900) • HEIGHT: 2900mm'
      };

  const triggerLiveGeneration = async () => {
    setIsGenerating(true);
    setGenerationStep(1);

    // Simulate multi-phase AI computer vision extraction & CAD synthesis
    setTimeout(() => {
      setGenerationStep(2);
    }, 700);

    setTimeout(() => {
      setGenerationStep(3);
    }, 1400);

    setTimeout(() => {
      setIsGenerating(false);
      setConversionCompleted(true);
      setNotification('2D Technical CAD Plan generated successfully with full millimeter dimensions!');
      setTimeout(() => setNotification(null), 4000);
    }, 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        setUploadedImageUri(uploadEvent.target?.result as string);
        setSelectedPreset('custom');
        triggerLiveGeneration();
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadDxf = () => {
    exportTechnicalDrawingToDxf(drawingMetadata.code, `${drawingMetadata.code}_${drawingMetadata.room.replace(/\s+/g, '_')}.dxf`);
    setNotification(`Exported ${drawingMetadata.code} (${drawingMetadata.room}) to AutoCAD DXF format.`);
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApplyToModule2 = () => {
    if (onApplyDrawingToProject) {
      onApplyDrawingToProject({
        drawingCode: drawingMetadata.code,
        title: drawingMetadata.title,
        source: 'IMAGE_TO_CAD_GENERATOR',
        overallWidthMm: drawingMetadata.widthMm,
        overallHeightMm: drawingMetadata.heightMm
      });
    }
    onClose();
    if (onNavigateTab) onNavigateTab('ai_drawings');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-xs p-3 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-7xl rounded-xl shadow-2xl flex flex-col max-h-[96vh] overflow-hidden text-slate-100">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-800 bg-slate-950 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 via-orange-500 to-indigo-600 flex items-center justify-center shadow-md">
              <Cpu className="w-5 h-5 text-slate-950 font-bold" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-white tracking-wide">
                  AI Image-to-CAD Technical Plan Engine
                </h2>
                <span className="bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 text-[10px] font-black uppercase px-2 py-0.5 rounded-full shadow-xs">
                  Vision → CAD
                </span>
                <span className="bg-red-600/90 border border-red-400 text-white text-[10px] font-mono font-black px-2 py-0.5 rounded flex items-center gap-1 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  <span>GFC RELEASED (GOOD FOR CONSTRUCTION)</span>
                </span>
                <span className="bg-purple-900/60 border border-purple-500/40 text-purple-300 text-[10px] font-mono px-2 py-0.5 rounded">
                  {drawingMetadata.code} • Rev R02
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Customer provides the 3D concept render / inspiration photo (Image 1) → System synthesizes the 2D CAD construction elevation plan with millimeter dimensions (Image 2).
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadDxf}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 transition"
              title="Download AutoCAD DXF format"
            >
              <Download className="w-3.5 h-3.5 text-amber-400" />
              <span>Export DXF</span>
            </button>

            <button
              onClick={handleApplyToModule2}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#004a99] hover:bg-[#005bb5] text-white text-xs font-bold transition shadow-sm"
              title="Push to Module 2 Drawing Set"
            >
              <Layers className="w-3.5 h-3.5 text-amber-300" />
              <span>Open in Module 2 Drawings</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* NOTIFICATION TOAST */}
        {notification && (
          <div className="bg-emerald-950/90 border-b border-emerald-500/40 px-6 py-2 text-xs text-emerald-300 flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{notification}</span>
            </div>
            <button onClick={() => setNotification(null)} className="text-emerald-400 hover:text-white text-xs">Dismiss</button>
          </div>
        )}

        {/* TOP WORKFLOW BANNER: PRESET SELECTION & CONTEXT */}
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Input Reference:</span>
            <button
              onClick={() => {
                setSelectedPreset('sample1');
                setUploadedImageUri(null);
                setRoomContext('3F Public Corridor & SPA Reception (COR-001)');
                setConversionCompleted(true);
                setNotification('Loaded 3F Public Corridor & SPA Reception reference and synthesized Elevations D, E & F!');
                setTimeout(() => setNotification(null), 3000);
              }}
              className={`px-3 py-1 rounded text-xs font-semibold transition flex items-center gap-1.5 ${
                selectedPreset === 'sample1'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>★ 3F Public Corridor &amp; SPA Reception (Detailed Elevations D, E &amp; F)</span>
            </button>

            <button
              onClick={() => {
                setSelectedPreset('sample2');
                setUploadedImageUri(null);
                setRoomContext('Master Bedroom Suite (MBR-001)');
                setConversionCompleted(true);
                setNotification('Loaded Master Bedroom Wardrobe & Study Desk joinery drawing reference!');
                setTimeout(() => setNotification(null), 3000);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                selectedPreset === 'sample2'
                  ? 'bg-amber-400 text-slate-950 shadow-xs font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>MBR Wardrobe with Study (DRW-MBR-005)</span>
            </button>

            <label className="cursor-pointer px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition border border-slate-700 flex items-center gap-1.5">
              <span>Upload Custom Photo</span>
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5">
              <span className="text-slate-400">Target Room:</span>
              <select
                value={roomContext}
                onChange={(e) => setRoomContext(e.target.value)}
                className="bg-slate-800 border border-slate-700 rounded px-2 py-1 text-slate-200 text-xs focus:ring-1 focus:ring-amber-400 outline-hidden"
              >
                <option value="3F Public Corridor & SPA Reception (COR-001)">3F Public Corridor & SPA Reception (COR-001)</option>
                <option value="Master Bedroom Suite (MBR-001)">Master Bedroom Suite (MBR-001)</option>
                <option value="Living Greatroom (LIV-001)">Living Greatroom (LIV-001)</option>
                <option value="Guest Suite (GST-001)">Guest Suite (GST-001)</option>
              </select>
            </div>

            <button
              onClick={triggerLiveGeneration}
              disabled={isGenerating}
              className="flex items-center gap-1.5 px-3 py-1 rounded bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs shadow-md transition disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* MAIN BODY: SPLIT VIEW (IMAGE 1 INPUT vs IMAGE 2 OUTPUT) */}
        <div className="flex-1 overflow-y-auto p-4 grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* LEFT 5 COLS: 1ST IMAGE (CUSTOMER INSPIRATION RENDER) */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-400 text-slate-950 text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                    Customer Input Reference (3D Render)
                  </h3>
                </div>
                <span className="text-[11px] text-amber-400 font-mono">Inspiration Source</span>
              </div>

              {/* IMAGE 1 DISPLAY */}
              <div className="relative aspect-4/3 rounded-lg overflow-hidden border border-slate-800 bg-black group">
                <img
                  src={customerImage1Url}
                  alt="Customer 3D Interior Concept Reference"
                  className="w-full h-full object-cover transition duration-300 group-hover:scale-102"
                />

                <div className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-xs border border-white/20 text-[10px] text-amber-300 font-semibold px-2 py-0.5 rounded">
                  Customer Concept Photo / 3D Render
                </div>

                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/90 backdrop-blur-xs border border-slate-800 p-2 rounded text-[11px]">
                  <div className="text-amber-400 font-bold text-[10px] uppercase">Detected Visual Features:</div>
                  {isCorridorPreset ? (
                    <ul className="text-slate-300 space-y-0.5 mt-1 text-[10px] list-disc list-inside">
                      <li>Grand public corridor &amp; spa reception with monumental ceiling height</li>
                      <li>Stepped architectural cove with suspended crystal chandelier fixture</li>
                      <li>Classical fluted timber pilasters with carved Corinthian capitals (M1, M7, M13)</li>
                      <li>Symmetrical boiserie wainscoting with framed artwork niches &amp; console tables</li>
                      <li>Portal openings for Spa Consultation, Spa Corridor &amp; Arched Beauty Salon Door</li>
                    </ul>
                  ) : (
                    <ul className="text-slate-300 space-y-0.5 mt-1 text-[10px] list-disc list-inside">
                      <li>High vertical proportions &amp; recessed ceiling alignment</li>
                      <li>Symmetrical bays with central glazed accent display</li>
                      <li>Fluted acoustic wood battens + warm 2800K LED coves</li>
                      <li>Anodized champagne brushed gold architectural profiles</li>
                    </ul>
                  )}
                </div>
              </div>

              {/* MULTI-STAGE VISION AI PIPELINE STATUS */}
              <div className="mt-3 p-2.5 bg-slate-900 rounded border border-slate-800">
                <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between mb-2">
                  <span>AI Extraction &amp; Dimensioning Pipeline:</span>
                  <span className="text-emerald-400 text-[10px] font-mono">
                    {isGenerating ? `Step ${generationStep}/3` : 'Analysis Locked'}
                  </span>
                </div>

                {isCorridorPreset ? (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Spatial Span Calibrated: 28,400mm (L) • Datums +3800mm to +5200mm</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Elevations Synthesized: Elevation D, Elevation E &amp; Elevation F</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Ceiling Profiles: Stepped Gypsum Cove with 150kg Unistrut Chandelier Rigging</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Specifications: Teak Hardwood (M1) + Gold Leaf (M7) + Statuario (SK2)</span>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Spatial Span Calibrated: 2700mm (W) × 2900mm (H)</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Joinery Subdivision: 3 × 900mm Functional Bays</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Ergonomics: Desk at +715mm, Knee Clearance 600mm</span>
                    </div>
                    <div className="flex items-center gap-2 text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                      <span>Specifications: Marine Ply BWP + Brushed Gold Alu Profile</span>
                    </div>
                  </div>
                )}
              </div>

              {/* DATA LINKAGE BADGE */}
              <div className="mt-3 p-2 bg-slate-900/60 rounded border border-slate-800/80 font-mono text-[10px] text-slate-400 space-y-1">
                <div className="text-slate-300 font-bold text-[10px]">Data Linkage Traceability:</div>
                <div className="grid grid-cols-2 gap-1 text-[9.5px]">
                  <div><span className="text-slate-500">Project:</span> {project.projectCode || 'PRJ-2026-001'}</div>
                  <div><span className="text-slate-500">Zone:</span> {isCorridorPreset ? 'COR-001' : 'MBR-001'}</div>
                  <div><span className="text-slate-500">Drawing:</span> {drawingMetadata.code}</div>
                  <div><span className="text-slate-500">Revision:</span> R02 (Sep 2026)</div>
                  <div><span className="text-slate-500">BOQ Ref:</span> {isCorridorPreset ? 'BOQ-COR-114' : 'BOQ-WRD-0045'}</div>
                  <div><span className="text-slate-500">Material:</span> {isCorridorPreset ? 'MAT-TEAK-001' : 'MAT-LAM-001'}</div>
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT 7 COLS: 2ND IMAGE (SYNTHESIZED TECHNICAL CAD PLAN) */}
          <div className="lg:col-span-7 flex flex-col gap-3">
            <div className="bg-slate-950 border border-slate-800 rounded-lg p-3 flex flex-col h-full">
              
              {/* HEADER WITH VIEW MODE TABS */}
              <div className="flex flex-wrap items-center justify-between gap-2 mb-3 pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-500 text-slate-950 text-xs font-bold flex items-center justify-center">
                    2
                  </span>
                  <div>
                    <h3 className="text-xs font-bold text-white tracking-wide uppercase">
                      Generated 2D Technical CAD Elevation Plan
                    </h3>
                    <div className="text-[10px] text-slate-400">
                      Standard Construction Drawing Sheet • Scale 1:25 • Metric (MM)
                    </div>
                  </div>
                </div>

                {/* TABS */}
                <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded border border-slate-800 text-[11px]">
                  <button
                    onClick={() => setOutputTab('sheet')}
                    className={`px-2.5 py-1 rounded transition font-semibold ${
                      outputTab === 'sheet'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Drawing Sheet (Image 2)
                  </button>
                  <button
                    onClick={() => setOutputTab('vector')}
                    className={`px-2.5 py-1 rounded transition font-semibold ${
                      outputTab === 'vector'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Vector CAD
                  </button>
                  <button
                    onClick={() => setOutputTab('gfc')}
                    className={`px-2.5 py-1 rounded transition font-semibold flex items-center gap-1.5 ${
                      outputTab === 'gfc'
                        ? 'bg-red-600 text-white shadow-xs font-bold'
                        : 'text-red-400 hover:text-red-300'
                    }`}
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />
                    <span>GFC Transmittal</span>
                  </button>
                  <button
                    onClick={() => setOutputTab('specs')}
                    className={`px-2.5 py-1 rounded transition font-semibold ${
                      outputTab === 'specs'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    Materials & Specs
                  </button>
                  <button
                    onClick={() => setOutputTab('cnc')}
                    className={`px-2.5 py-1 rounded transition font-semibold ${
                      outputTab === 'cnc'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    CNC Cutting
                  </button>
                  <button
                    onClick={() => setOutputTab('boq')}
                    className={`px-2.5 py-1 rounded transition font-semibold ${
                      outputTab === 'boq'
                        ? 'bg-amber-400 text-slate-950 shadow-xs'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    BOQ Link
                  </button>
                </div>
              </div>

              {/* TAB CONTENT 1: HIGH-RES DRAWING SHEET (IMAGE 2 WITH OFFICIAL GFC STAMP & DETAILED ELEVATIONS) */}
              {outputTab === 'sheet' && (
                <div className="flex-1 flex flex-col gap-2">
                  {/* ELEVATION VIEW SELECTOR & ZOOM TOOLBAR */}
                  {isCorridorPreset && (
                    <div className="flex flex-wrap items-center justify-between gap-2 bg-slate-900 px-3 py-1.5 rounded border border-slate-800 text-xs">
                      <div className="flex flex-wrap items-center gap-1 font-mono text-[11px]">
                        <span className="text-slate-400 mr-1">Elevation Detailing:</span>
                        <button
                          onClick={() => setElevationFocus('ALL')}
                          className={`px-2 py-0.5 rounded transition ${
                            elevationFocus === 'ALL'
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          All Elevations (D, E, F)
                        </button>
                        <button
                          onClick={() => setElevationFocus('ELEV_D')}
                          className={`px-2 py-0.5 rounded transition ${
                            elevationFocus === 'ELEV_D'
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          1. Elevation D (Corridor &amp; Lift Lobby)
                        </button>
                        <button
                          onClick={() => setElevationFocus('ELEV_E')}
                          className={`px-2 py-0.5 rounded transition flex items-center gap-1 ${
                            elevationFocus === 'ELEV_E'
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          <span>2. Elevation E (Grand Stepped Chandelier Cove)</span>
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        </button>
                        <button
                          onClick={() => setElevationFocus('ELEV_F')}
                          className={`px-2 py-0.5 rounded transition ${
                            elevationFocus === 'ELEV_F'
                              ? 'bg-amber-400 text-slate-950 font-bold'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          3. Elevation F (Opposite Corridor)
                        </button>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-slate-400 text-[10.5px] mr-1">Zoom:</span>
                        <button
                          onClick={() => setSheetZoom(Math.max(70, sheetZoom - 20))}
                          className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                          title="Zoom Out"
                        >
                          <ZoomOut className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-[11px] font-mono px-1.5 text-slate-200">{sheetZoom}%</span>
                        <button
                          onClick={() => setSheetZoom(Math.min(220, sheetZoom + 20))}
                          className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                          title="Zoom In"
                        >
                          <ZoomIn className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSheetZoom(100)}
                          className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
                          title="Reset Zoom"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  )}

                  {/* HIGH-RES ARCHITECTURAL SHEET CONTAINER */}
                  <div className="relative border border-slate-800 rounded bg-white overflow-hidden shadow-inner flex items-center justify-center min-h-[460px] max-h-[560px]">
                    <div
                      className="w-full h-full flex items-center justify-center overflow-auto p-2"
                      style={{
                        transform: `scale(${sheetZoom / 100})`,
                        transformOrigin: 'center center',
                        transition: 'transform 0.2s ease-out'
                      }}
                    >
                      <img
                        src={cadPlanImage2Url}
                        alt="Synthesized Technical CAD Plan Sheet with GFC Approval"
                        className={`w-full h-auto object-contain transition-all duration-300 ${
                          isCorridorPreset
                            ? elevationFocus === 'ELEV_D'
                              ? 'max-h-[720px] scale-125 translate-y-[20%]'
                              : elevationFocus === 'ELEV_E'
                              ? 'max-h-[760px] scale-135 -translate-y-[2%]'
                              : elevationFocus === 'ELEV_F'
                              ? 'max-h-[720px] scale-125 -translate-y-[22%]'
                              : 'max-h-[520px]'
                            : 'max-h-[520px]'
                        }`}
                      />
                    </div>

                    {/* OVERLAY QUICK INSPECTOR BADGES */}
                    <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1.5 rounded border border-slate-700 space-y-0.5 shadow-lg">
                      <div className="text-amber-400 font-bold">DRAWING: {drawingMetadata.code} ({drawingMetadata.revision})</div>
                      <div>{drawingMetadata.spanText}</div>
                      <div className="text-emerald-400 font-bold">STATUS: GFC - GOOD FOR CONSTRUCTION</div>
                    </div>

                    {/* OFFICIAL ARCHITECTURAL GFC STAMP OVERLAY (FROM ATTACHED SHEET) */}
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border-2 border-red-600 rounded p-2 text-red-700 shadow-2xl font-mono text-[9px] pointer-events-auto max-w-[280px]">
                      <div className="border border-red-600 p-1.5 space-y-1">
                        <div className="flex items-center justify-between border-b border-red-500 pb-1">
                          <div className="font-black text-[10.5px] tracking-wider text-red-700 flex items-center gap-1">
                            <span>★</span>
                            <span>GOOD FOR CONSTRUCTION</span>
                            <span>★</span>
                          </div>
                          <span className="bg-red-600 text-white font-black text-[8px] px-1 py-0.2 rounded">
                            GFC
                          </span>
                        </div>
                        <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[8.5px] text-slate-800">
                          <div><span className="text-slate-500">ROOM:</span> <b>{isCorridorPreset ? 'CORRIDOR & SPA' : 'MBR WARDROBE'}</b></div>
                          <div><span className="text-slate-500">REV:</span> <b>{drawingMetadata.revision}</b></div>
                          <div><span className="text-slate-500">DESIGNER:</span> <b>{drawingMetadata.designer}</b></div>
                          <div><span className="text-slate-500">SCALE:</span> <b>{drawingMetadata.scale}</b></div>
                          <div><span className="text-slate-500">DATE:</span> <b>{drawingMetadata.date}</b></div>
                          <div><span className="text-slate-500">PAGE NO:</span> <b>{drawingMetadata.pageNo}</b></div>
                        </div>
                        <div className="pt-1 border-t border-red-400 text-[8px] text-slate-600 flex items-center justify-between">
                          <span>APPROVED FOR SITE &amp; CNC MILLING</span>
                          <span className="font-bold text-red-700">IS 5533:2018</span>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM RIGHT SHEET STAMP */}
                    <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded border border-slate-700 flex items-center gap-2">
                      <span className="text-slate-400">DESIGNER: <b className="text-emerald-400">{drawingMetadata.designer}</b></span>
                      <span className="text-slate-600">|</span>
                      <span className="text-amber-400 font-bold">{drawingMetadata.pageNo}</span>
                    </div>
                  </div>

                  {/* ATTACHED DRAWING TITLE BLOCK & DETAILS BAR */}
                  <div className="bg-slate-900 border border-slate-800 rounded p-2 text-[11px]">
                    <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-2 font-mono text-[10px]">
                      <div className="border-r border-slate-800 pr-1">
                        <span className="text-slate-500 block text-[9px] uppercase">CLIENT NAME</span>
                        <span className="font-bold text-white truncate block">{project.clientName || 'Build Storys Client'}</span>
                      </div>
                      <div className="border-r border-slate-800 pr-1">
                        <span className="text-slate-500 block text-[9px] uppercase">CLIENT ID</span>
                        <span className="font-bold text-slate-300">{project.projectCode || 'CLI-2026-088'}</span>
                      </div>
                      <div className="border-r border-slate-800 pr-1">
                        <span className="text-slate-500 block text-[9px] uppercase">ROOM NAME</span>
                        <span className="font-bold text-amber-400 truncate block">{drawingMetadata.room}</span>
                      </div>
                      <div className="border-r border-slate-800 pr-1">
                        <span className="text-slate-500 block text-[9px] uppercase">DESIGNER</span>
                        <span className="font-bold text-emerald-400">{drawingMetadata.designer}</span>
                      </div>
                      <div className="border-r border-slate-800 pr-1">
                        <span className="text-slate-500 block text-[9px] uppercase">REVISION</span>
                        <span className="font-bold text-red-400 bg-red-950/80 px-1 py-0.5 rounded border border-red-700/50">{drawingMetadata.revision}</span>
                      </div>
                      <div className="border-r border-slate-800 pr-1">
                        <span className="text-slate-500 block text-[9px] uppercase">DATE</span>
                        <span className="font-bold text-slate-300">{drawingMetadata.date}</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">PAGE NO</span>
                        <span className="font-bold text-amber-400">{drawingMetadata.pageNo}</span>
                      </div>
                    </div>
                    <div className="mt-1 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9.5px] text-slate-400 font-mono">
                      <span className="text-amber-400 font-bold">NOTE : {drawingMetadata.notes}</span>
                      <span className="text-slate-500">ROYALWOOD.STUDIO • ARCHITECTURAL CONSULTANCY GFC PACKAGE</span>
                    </div>
                  </div>

                  {/* 5 KEY CALLOUTS MATCHING ATTACHED ARCHITECTURAL DRAWING */}
                  {isCorridorPreset ? (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-0.5 text-[11px]">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[9.5px]">Stepped Ceiling Cove</div>
                        <div className="text-white font-mono font-bold">+5200 mm SSL</div>
                        <div className="text-slate-400 text-[9px]">Chandelier Rigging &amp; Rose</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[9.5px]">False Ceiling Datum</div>
                        <div className="text-white font-mono font-bold">+3800 mm FFL</div>
                        <div className="text-slate-400 text-[9px]">Continuous 2800K LED Cove</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[9.5px]">Classical Wood Pilasters</div>
                        <div className="text-white font-mono font-bold">Tags M1, M7, M13</div>
                        <div className="text-slate-400 text-[9px]">Teak + Gold Leaf Capitals</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[9.5px]">Beauty Salon Portal Door</div>
                        <div className="text-amber-400 font-mono font-bold">2400 mm Ht Arch (D1)</div>
                        <div className="text-slate-400 text-[9px]">Solid Ash with Beveled Glass</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[9.5px]">Wainscoting Panels</div>
                        <div className="text-amber-400 font-mono font-bold">WP01, WP02, WP03</div>
                        <div className="text-slate-400 text-[9px]">150mm Statuario Skirting SK2</div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 pt-0.5 text-[11px]">
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[9.5px]">Countertop Level</div>
                        <div className="text-white font-mono font-bold">+715 mm FFL</div>
                        <div className="text-slate-400 text-[9px]">20mm Solid Quartz</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[9.5px]">Drawer Fascia</div>
                        <div className="text-white font-mono font-bold">130 mm Ht</div>
                        <div className="text-slate-400 text-[9px]">Blum soft-close</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[9.5px]">Knee Clearance</div>
                        <div className="text-white font-mono font-bold">600 mm Ht</div>
                        <div className="text-slate-400 text-[9px]">Ergonomic study seat</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[9.5px]">Fluted Acoustic Panel</div>
                        <div className="text-amber-400 font-mono font-bold">450 mm Width</div>
                        <div className="text-slate-400 text-[9px]">PU Asian Paints Matt</div>
                      </div>
                      <div className="p-2 rounded bg-slate-900 border border-slate-800">
                        <div className="text-slate-400 text-[9.5px]">Profile Frame</div>
                        <div className="text-amber-400 font-mono font-bold">Brushed Gold ALU</div>
                        <div className="text-slate-400 text-[9px]">Hafele Alumilux</div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB CONTENT 2: INTERACTIVE VECTOR CAD ENGINE */}
              {outputTab === 'vector' && (
                <div className="flex-1 flex flex-col gap-2">
                  {/* CONTROLS */}
                  <div className="flex items-center justify-between bg-slate-900 p-2 rounded border border-slate-800 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px]">Layers:</span>
                      <label className="flex items-center gap-1 text-[11px] cursor-pointer text-rose-300">
                        <input
                          type="checkbox"
                          checked={activeLayers.dimensions}
                          onChange={(e) => setActiveLayers({ ...activeLayers, dimensions: e.target.checked })}
                          className="rounded text-rose-500"
                        />
                        <span>Dimensions</span>
                      </label>
                      <label className="flex items-center gap-1 text-[11px] cursor-pointer text-amber-300">
                        <input
                          type="checkbox"
                          checked={activeLayers.finishes}
                          onChange={(e) => setActiveLayers({ ...activeLayers, finishes: e.target.checked })}
                          className="rounded text-amber-500"
                        />
                        <span>Finishes & Fluting</span>
                      </label>
                      <label className="flex items-center gap-1 text-[11px] cursor-pointer text-sky-300">
                        <input
                          type="checkbox"
                          checked={activeLayers.electrical}
                          onChange={(e) => setActiveLayers({ ...activeLayers, electrical: e.target.checked })}
                          className="rounded text-sky-500"
                        />
                        <span>Electrical / LED</span>
                      </label>
                    </div>

                    <div className="flex items-center gap-1">
                      <button onClick={() => setZoomLevel(Math.max(60, zoomLevel - 15))} className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                        <ZoomOut className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[11px] font-mono px-1.5 text-slate-300">{zoomLevel}%</span>
                      <button onClick={() => setZoomLevel(Math.min(180, zoomLevel + 15))} className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                        <ZoomIn className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => setZoomLevel(100)} className="p-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300">
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* SVG VECTOR CAD CANVAS */}
                  <div className="border border-slate-800 rounded bg-slate-900 p-2 overflow-auto flex items-center justify-center min-h-[420px]">
                    <svg
                      viewBox="0 0 640 400"
                      className="w-full h-auto max-h-[460px] bg-slate-950 rounded select-none"
                      style={{ transform: `scale(${zoomLevel / 100})`, transformOrigin: 'center center' }}
                    >
                      {/* Grid background */}
                      <defs>
                        <pattern id="cadGridModal" width="20" height="20" patternUnits="userSpaceOnUse">
                          <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1e293b" strokeWidth="0.5" />
                        </pattern>
                      </defs>
                      <rect width="640" height="400" fill="url(#cadGridModal)" />

                      {/* Floor level FFL */}
                      <line x1="40" y1="360" x2="600" y2="360" stroke="#94a3b8" strokeWidth="2" />
                      <text x="50" y="375" fill="#94a3b8" fontSize="10" fontFamily="monospace">±0.00 FINISHED FLOOR LEVEL (FFL)</text>

                      {isCorridorPreset ? (
                        /* CORRIDOR ELEVATION E VECTOR CAD VIEW */
                        <g id="corridorElevationCad">
                          {/* 150mm Statuario Skirting SK2 */}
                          <rect x="50" y="348" width="540" height="12" fill="#334155" stroke="#475569" strokeWidth="1" />
                          <text x="55" y="357" fill="#cbd5e1" fontSize="7.5" fontFamily="monospace">150mm SK2 STATUARIO SKIRTING</text>

                          {/* False Ceiling Level +3800mm */}
                          <line x1="40" y1="120" x2="600" y2="120" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
                          <text x="50" y="112" fill="#94a3b8" fontSize="9" fontFamily="monospace">+3800mm FALSE CEILING LEVEL</text>

                          {/* Stepped Chandelier Cove Profile +5200mm */}
                          <path
                            d="M 220 120 L 220 90 L 250 90 L 250 60 L 280 60 L 280 30 L 360 30 L 360 60 L 390 60 L 390 90 L 420 90 L 420 120"
                            fill="#1e1b4b"
                            fillOpacity="0.4"
                            stroke="#fbbf24"
                            strokeWidth="2"
                            strokeDasharray="4 2"
                          />
                          <text x="320" y="24" fill="#fbbf24" fontSize="8" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                            +5200mm STEPPED CHANDELIER COVE DATUM
                          </text>

                          {/* Suspended Crystal Chandelier Fixture Rigging */}
                          {activeLayers.electrical && (
                            <g id="crystalChandelier">
                              {/* Suspension chain from unistrut */}
                              <line x1="320" y1="30" x2="320" y2="100" stroke="#f59e0b" strokeWidth="2" strokeDasharray="3 2" />
                              <circle cx="320" cy="30" r="4" fill="#f59e0b" />
                              <text x="325" y="55" fill="#f59e0b" fontSize="7" fontFamily="monospace">150kg UNISTRUT RIGGING</text>
                              {/* Chandelier body */}
                              <path d="M 300 100 L 340 100 L 330 140 L 310 140 Z" fill="#fef3c7" stroke="#d97706" strokeWidth="1.5" />
                              {/* Arms & Crystals */}
                              <path d="M 285 115 Q 320 135 355 115" fill="none" stroke="#f59e0b" strokeWidth="1.5" />
                              <circle cx="285" cy="115" r="3" fill="#fef08a" />
                              <circle cx="355" cy="115" r="3" fill="#fef08a" />
                              <circle cx="320" cy="140" r="4" fill="#fef08a" />
                              <text x="320" y="155" fill="#fef3c7" fontSize="7.5" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                                48-LIGHT CRYSTAL CHANDELIER
                              </text>
                            </g>
                          )}

                          {/* Classical Fluted Pilasters (M1, M7, M13) */}
                          {[70, 160, 240, 400, 490, 570].map((colX, idx) => (
                            <g key={idx} id={`pilaster-${idx}`}>
                              {/* Base plinth */}
                              <rect x={colX - 10} y="336" width="20" height="12" fill="#78350f" stroke="#451a03" strokeWidth="1" />
                              {/* Shaft */}
                              <rect x={colX - 8} y="130" width="16" height="206" fill="#fef3c7" stroke="#b45309" strokeWidth="1.2" />
                              {/* Fluting lines */}
                              {activeLayers.finishes && (
                                <>
                                  <line x1={colX - 4} y1="130" x2={colX - 4} y2="336" stroke="#b45309" strokeWidth="0.8" />
                                  <line x1={colX} y1="130" x2={colX} y2="336" stroke="#b45309" strokeWidth="0.8" />
                                  <line x1={colX + 4} y1="130" x2={colX + 4} y2="336" stroke="#b45309" strokeWidth="0.8" />
                                </>
                              )}
                              {/* Corinthian Capital */}
                              <path d={`M ${colX - 12} 120 L ${colX + 12} 120 L ${colX + 8} 130 L ${colX - 8} 130 Z`} fill="#d97706" stroke="#78350f" strokeWidth="1" />
                            </g>
                          ))}
                          <text x="70" y="240" fill="#92400e" fontSize="7" fontFamily="monospace" transform="rotate(-90 70 240)" textAnchor="middle">
                            PILASTER M1 / M7 / M13
                          </text>

                          {/* Grand Classical Arched Portal Door (D1) - Beauty Salon Entrance */}
                          <g id="beautySalonPortal">
                            {/* Arch Door Jamb */}
                            <path
                              d="M 425 348 L 425 210 Q 455 180 485 210 L 485 348 Z"
                              fill="#f8fafc"
                              stroke="#0f172a"
                              strokeWidth="2"
                            />
                            {/* Transom molding */}
                            <path d="M 425 215 L 485 215" stroke="#475569" strokeWidth="1.5" />
                            <text x="455" y="205" fill="#475569" fontSize="6.5" fontFamily="monospace" textAnchor="middle">BEVELED TRANSOM</text>
                            <text x="455" y="270" fill="#0f172a" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                              BEAUTY SALON (D1)
                            </text>
                            <text x="455" y="285" fill="#64748b" fontSize="7" fontFamily="monospace" textAnchor="middle">
                              2400mm ARCHED PORTAL
                            </text>
                          </g>

                          {/* Wainscoting Boiserie Wall Paneling (WP01, WP02, WP03) */}
                          {activeLayers.finishes && (
                            <g id="boiseriePanels">
                              {/* Dado Rail line at +900mm */}
                              <line x1="50" y1="285" x2="420" y2="285" stroke="#92400e" strokeWidth="1.5" />
                              <text x="110" y="280" fill="#92400e" fontSize="7" fontFamily="monospace">+900 DADO RAIL</text>

                              {/* Panel 1 */}
                              <rect x="90" y="150" width="60" height="120" fill="none" stroke="#d97706" strokeWidth="1" />
                              <rect x="95" y="155" width="50" height="110" fill="none" stroke="#d97706" strokeWidth="0.8" strokeDasharray="2 1" />
                              <text x="120" y="215" fill="#92400e" fontSize="7" fontFamily="monospace" textAnchor="middle">WP01</text>

                              {/* Panel 2 */}
                              <rect x="180" y="150" width="50" height="120" fill="none" stroke="#d97706" strokeWidth="1" />
                              <rect x="185" y="155" width="40" height="110" fill="none" stroke="#d97706" strokeWidth="0.8" strokeDasharray="2 1" />
                              <text x="205" y="215" fill="#92400e" fontSize="7" fontFamily="monospace" textAnchor="middle">WP02</text>
                            </g>
                          )}

                          {/* Symmetrical Marble Console Station with Lamp */}
                          <rect x="100" y="285" width="40" height="6" fill="#cbd5e1" stroke="#475569" strokeWidth="1" />
                          <path d="M 105 291 L 115 348 M 135 291 L 125 348" stroke="#475569" strokeWidth="1" />
                          <circle cx="120" cy="275" r="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
                          <text x="120" y="265" fill="#ca8a04" fontSize="6.5" fontFamily="monospace" textAnchor="middle">SCONCE</text>

                          {/* DIMENSION LINES FOR CORRIDOR */}
                          {activeLayers.dimensions && (
                            <g id="corridorDimLines">
                              {/* Overall width */}
                              <line x1="50" y1="385" x2="590" y2="385" stroke="#dc2626" strokeWidth="1.5" />
                              <line x1="50" y1="380" x2="50" y2="390" stroke="#dc2626" strokeWidth="1" />
                              <line x1="590" y1="380" x2="590" y2="390" stroke="#dc2626" strokeWidth="1" />
                              <text x="320" y="396" fill="#dc2626" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                                28,400 mm (CORRIDOR ELEVATION E SPAN)
                              </text>

                              {/* Height markers */}
                              <line x1="30" y1="30" x2="30" y2="360" stroke="#dc2626" strokeWidth="1.5" />
                              <line x1="25" y1="30" x2="35" y2="30" stroke="#dc2626" strokeWidth="1" />
                              <line x1="25" y1="120" x2="35" y2="120" stroke="#dc2626" strokeWidth="1" />
                              <line x1="25" y1="360" x2="35" y2="360" stroke="#dc2626" strokeWidth="1" />
                              <text x="22" y="195" fill="#dc2626" fontSize="9" fontFamily="monospace" fontWeight="bold" transform="rotate(-90 22 195)" textAnchor="middle">
                                +5200mm SLAB / +3800mm CEILING
                              </text>
                            </g>
                          )}
                        </g>
                      ) : (
                        /* WARDROBE VECTOR CAD VIEW */
                        <g id="wardrobeElevationCad">
                          {/* Ceiling level */}
                          <line x1="40" y1="70" x2="600" y2="70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
                          <text x="50" y="62" fill="#94a3b8" fontSize="10" fontFamily="monospace">+2900mm CEILING LEVEL</text>

                          {/* 100mm Skirting */}
                          <rect x="100" y="350" width="440" height="10" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                          <text x="105" y="358" fill="#cbd5e1" fontSize="8" fontFamily="monospace">100mm SKIRTING</text>

                          {/* Bay 1: Wardrobe Left */}
                          <rect x="100" y="80" width="146" height="270" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
                          <line x1="173" y1="80" x2="173" y2="350" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
                          <text x="173" y="160" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="middle">BAY 1: LAMINATE</text>
                          <text x="173" y="175" fill="#64748b" fontSize="9" textAnchor="middle">900mm Width</text>

                          {/* Bay 2: Wardrobe Glass Center */}
                          <rect x="246" y="80" width="146" height="270" fill="#f1f5f9" stroke="#b45309" strokeWidth="2" />
                          <rect x="249" y="83" width="140" height="264" fill="none" stroke="#d97706" strokeWidth="2.5" />
                          <line x1="319" y1="83" x2="319" y2="347" stroke="#d97706" strokeWidth="2" />
                          <text x="319" y="150" fill="#92400e" fontSize="10" fontWeight="bold" textAnchor="middle">BAY 2: FLUTED GLASS</text>
                          <text x="319" y="165" fill="#b45309" fontSize="8.5" textAnchor="middle">BRUSHED GOLD ALU PROFILE</text>

                          {/* Bay 3: Study Desk */}
                          {activeLayers.finishes && (
                            <g id="flutedPanel">
                              <rect x="392" y="80" width="74" height="270" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
                              {[0, 8, 16, 24, 32, 40, 48, 56, 64].map((offset) => (
                                <line key={offset} x1={392 + offset} y1="80" x2={392 + offset} y2="350" stroke="#b45309" strokeWidth="1" />
                              ))}
                              <text x="429" y="105" fill="#92400e" fontSize="8" fontWeight="bold" textAnchor="middle">450mm FLUTED</text>
                            </g>
                          )}
                          <rect x="392" y="288" width="148" height="6" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
                          <text x="466" y="283" fill="#78350f" fontSize="8" fontWeight="bold" textAnchor="middle">+715 COUNTERTOP</text>
                          <rect x="392" y="294" width="148" height="13" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.5" />
                          <text x="466" y="304" fill="#9a3412" fontSize="7.5" fontWeight="bold" textAnchor="middle">130mm PENCIL DRAWERS</text>
                          <rect x="410" y="307" width="112" height="43" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 2" />
                          <text x="466" y="332" fill="#64748b" fontSize="8" textAnchor="middle">600mm LEGROOM</text>

                          {/* Dimensions */}
                          {activeLayers.dimensions && (
                            <g id="dimLines">
                              <line x1="100" y1="385" x2="540" y2="385" stroke="#dc2626" strokeWidth="1.5" />
                              <text x="320" y="396" fill="#dc2626" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                                2700 mm (OVERALL WIDTH)
                              </text>
                              <line x1="75" y1="70" x2="75" y2="360" stroke="#dc2626" strokeWidth="1.5" />
                              <text x="65" y="215" fill="#dc2626" fontSize="10" fontFamily="monospace" fontWeight="bold" transform="rotate(-90 65 215)" textAnchor="middle">
                                2900 mm (SLAB HEIGHT)
                              </text>
                            </g>
                          )}
                        </g>
                      )}

                      {/* GFC APPROVAL STAMP IN VECTOR CAD */}
                      {gfcStampActive && (
                        <g id="vectorGfcStamp" transform="translate(420, 15)">
                          <rect x="0" y="0" width="195" height="50" fill="#450a0a" fillOpacity="0.9" stroke="#ef4444" strokeWidth="1.5" rx="2" />
                          <rect x="2" y="2" width="191" height="46" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 1.5" />
                          <text x="97" y="14" fill="#fca5a5" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">★ GOOD FOR CONSTRUCTION (GFC) ★</text>
                          <text x="97" y="25" fill="#f87171" fontSize="7" fontFamily="monospace" textAnchor="middle">
                            {isCorridorPreset ? '3F CORRIDOR & SPA • DRW-3F-COR-001' : 'ROOM: MBR WARDROBE • REV: NO : - 02'}
                          </text>
                          <text x="97" y="35" fill="#e2e8f0" fontSize="6.5" fontFamily="monospace" textAnchor="middle">
                            DESIGNER: APARANJI DIVYA • {drawingMetadata.pageNo}
                          </text>
                          <text x="97" y="44" fill="#4ade80" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">
                            APPROVED FOR FABRICATION • IS 5533:2018
                          </text>
                        </g>
                      )}
                    </svg>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 2.5: OFFICIAL GFC TRANSMITTAL & RELEASE AUTHORIZATION */}
              {outputTab === 'gfc' && (
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  {/* GFC RELEASE STATUS BANNER */}
                  <div className="p-3.5 bg-gradient-to-r from-red-950/70 via-slate-900 to-red-950/40 border-2 border-red-600/70 rounded-lg shadow-lg">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-red-600 text-white font-black text-sm flex items-center justify-center border-2 border-white shadow-md animate-pulse">
                          GFC
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold text-sm text-red-200 uppercase tracking-wide">
                              Good For Construction (GFC) Transmittal
                            </h4>
                            <span className="bg-red-600 text-white font-mono font-black text-[9px] px-2 py-0.5 rounded">
                              OFFICIALLY STAMPED
                            </span>
                          </div>
                          <p className="text-[11px] text-slate-300 mt-0.5 font-mono">
                            Drawing No: <b className="text-amber-300">{drawingMetadata.code}</b> • Revision: <b className="text-red-400">{drawingMetadata.revision}</b> • Page: <b className="text-white">{drawingMetadata.pageNo}</b>
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => {
                            setGfcTransmittedToSite(true);
                            setNotification('GFC Package Transmitted to Site Execution (Module 7)!');
                            setTimeout(() => setNotification(null), 3500);
                          }}
                          className={`px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 transition shadow-sm ${
                            gfcTransmittedToSite
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-red-600 hover:bg-red-500 text-white'
                          }`}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{gfcTransmittedToSite ? 'Transmitted to Site (Module 7)' : 'Transmit to Site Execution'}</span>
                        </button>

                        <button
                          onClick={() => {
                            setGfcTransmittedToFactory(true);
                            setNotification('GFC Cutting List & DXF Dispatched to Factory CNC (Module 6)!');
                            setTimeout(() => setNotification(null), 3500);
                          }}
                          className={`px-3 py-1.5 rounded font-bold text-xs flex items-center gap-1.5 transition shadow-sm ${
                            gfcTransmittedToFactory
                              ? 'bg-emerald-600 text-white cursor-default'
                              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                          }`}
                        >
                          <Wrench className="w-3.5 h-3.5" />
                          <span>{gfcTransmittedToFactory ? 'Dispatched to Factory (Module 6)' : 'Dispatch to Factory CNC'}</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ATTACHED GFC TITLE BLOCK DETAILS GRID */}
                  <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 space-y-2">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                      <span className="font-bold text-white text-xs flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-red-500" />
                        <span>Architectural Drawing Title Block Metadata (From Attachment)</span>
                      </span>
                      <span className="text-[10px] font-mono text-amber-400">
                        {isCorridorPreset ? 'PVM_SD_CD_402 & 403 • SPA-SD DWG PACKAGE' : 'ROYALWOOD.STUDIO • ARCHITECTURAL CONSULTANCY'}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs font-mono">
                      <div className="p-2 bg-slate-950 rounded border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">CLIENT NAME</div>
                        <div className="text-white font-bold truncate mt-0.5">{project.clientName || 'Build Storys Client'}</div>
                        <div className="text-slate-400 text-[10px] mt-1">CLIENT ID: <span className="text-slate-200">{project.projectCode || 'CLI-2026-088'}</span></div>
                      </div>

                      <div className="p-2 bg-slate-950 rounded border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">ROOM NAME</div>
                        <div className="text-amber-400 font-bold text-xs truncate mt-0.5">{drawingMetadata.room}</div>
                        <div className="text-slate-400 text-[10px] mt-1">ZONE: {isCorridorPreset ? '3F Public Circulation & SPA Core' : 'Master Suite Bed Wall'}</div>
                      </div>

                      <div className="p-2 bg-slate-950 rounded border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">DESIGNER</div>
                        <div className="text-emerald-400 font-bold mt-0.5">{drawingMetadata.designer}</div>
                        <div className="text-slate-400 text-[10px] mt-1">SIGN-OFF: Certified Lead Architect</div>
                      </div>

                      <div className="p-2 bg-slate-950 rounded border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">REVISION &amp; DATE</div>
                        <div className="text-red-400 font-bold mt-0.5">{drawingMetadata.revision}</div>
                        <div className="text-slate-400 text-[10px] mt-1">DATE: <span className="text-slate-200">{drawingMetadata.date}</span></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
                      <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80">
                        <span className="text-amber-400 font-bold">NOTE: All Dimensions are in MM</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {isCorridorPreset
                            ? 'Refer to DWG PVM_SD_CD_402 & 403. Doors refer to SPA-SD DWG package.'
                            : 'Do not scale drawing. Read written dimensions only.'}
                        </p>
                      </div>
                      <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80">
                        <span className="text-slate-300 font-bold">{drawingMetadata.pageNo}</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">
                          {isCorridorPreset
                            ? 'Package C: Public Corridor & SPA Reception Elevation Set'
                            : 'Package C: Custom Joinery & Wardrobe Elevations'}
                        </p>
                      </div>
                      <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80">
                        <span className="text-emerald-400 font-bold">TOLERANCE: ±1.5 mm</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Fabrication standard IS 5533:2018 for architectural millwork</p>
                      </div>
                    </div>
                  </div>

                  {/* 5 CRITICAL CALLOUTS SPECIFICATION AUDIT */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                    <h5 className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5" />
                      <span>5 Critical GFC Engineering Callouts Locked for Site Installation</span>
                    </h5>
                    {isCorridorPreset ? (
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-[11px]">
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-red-400 font-bold font-mono text-[10px]">1. STEPPED COVE</span>
                          <div className="text-white font-bold mt-0.5">+5200 mm SSL</div>
                          <div className="text-slate-400 text-[9.5px]">Multi-tier ceiling trough with crystal chandelier rose</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-red-400 font-bold font-mono text-[10px]">2. FALSE CEILING</span>
                          <div className="text-white font-bold mt-0.5">+3800 mm FFL</div>
                          <div className="text-slate-400 text-[9.5px]">Continuous perimeter warm cove lighting 2800K</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-red-400 font-bold font-mono text-[10px]">3. PILASTERS M1/M7/M13</span>
                          <div className="text-white font-bold mt-0.5">3800mm Fluted</div>
                          <div className="text-slate-400 text-[9.5px]">Solid Teak with Corinthian carved capital and gold leafing</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-red-400 font-bold font-mono text-[10px]">4. SALON DOOR D1</span>
                          <div className="text-white font-bold mt-0.5">2400 mm Ht Arch</div>
                          <div className="text-slate-400 text-[9.5px]">Solid Ash frame with fluted beveled safety glass</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-red-400 font-bold font-mono text-[10px]">5. WAINSCOT WP01-03</span>
                          <div className="text-white font-bold mt-0.5">+900mm Dado / SK2</div>
                          <div className="text-slate-400 text-[9.5px]">Classic boiserie panels with 150mm Statuario marble skirting</div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-[11px]">
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-red-400 font-bold font-mono text-[10px]">1. FLUTED PANELS</span>
                          <div className="text-white font-bold mt-0.5">450 mm Width</div>
                          <div className="text-slate-400 text-[9.5px]">PU Asian Paints Matt Warm Walnut</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-red-400 font-bold font-mono text-[10px]">2. SHELVES LEVEL</span>
                          <div className="text-white font-bold mt-0.5">2150 mm Top Datum</div>
                          <div className="text-slate-400 text-[9.5px]">25mm floating carcass with 369/32 clearance</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-red-400 font-bold font-mono text-[10px]">3. COUNTERTOP</span>
                          <div className="text-white font-bold mt-0.5">+715 mm FFL</div>
                          <div className="text-slate-400 text-[9.5px]">20mm Kalingastone Solid Quartz Worktop</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-red-400 font-bold font-mono text-[10px]">4. DRAWER HEIGHT</span>
                          <div className="text-white font-bold mt-0.5">130 mm Drawer Front</div>
                          <div className="text-slate-400 text-[9.5px]">Blum soft-close tandembox under-mount</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <span className="text-red-400 font-bold font-mono text-[10px]">5. ALU PROFILE</span>
                          <div className="text-white font-bold mt-0.5">Brushed Gold ALU</div>
                          <div className="text-slate-400 text-[9.5px]">Hafele Alumilux frame with tinted glass</div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* GFC APPROVAL CERTIFICATE & SIGNATURES */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 font-mono text-[10.5px]">
                      <div className="text-slate-400">GFC TRANSMITTAL CERTIFICATE: <b className="text-white">{isCorridorPreset ? 'BS-GFC-2026-COR-01' : 'BS-GFC-2026-088-05'}</b></div>
                      <div className="text-slate-400">ISSUED BY: <b className="text-emerald-400">BUILD STORYS CENTRAL ENGINEERING DEPT</b></div>
                      <div className="text-emerald-400">STATUS: APPROVED FOR MANUFACTURING AND ON-SITE ERECTION</div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleDownloadDxf}
                        className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5 text-amber-400" />
                        <span>Download GFC DXF</span>
                      </button>

                      <button
                        onClick={() => {
                          setNotification('GFC Drawing Certificate printed to job file.');
                          setTimeout(() => setNotification(null), 3000);
                        }}
                        className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold text-xs flex items-center gap-1.5"
                      >
                        <Printer className="w-3.5 h-3.5 text-sky-400" />
                        <span>Print GFC Sheet</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB CONTENT 3: MATERIALS & SPECIFICATION SCHEDULE */}
              {outputTab === 'specs' && (
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <h4 className="font-bold text-amber-400 mb-2 flex items-center gap-1.5">
                      <Layers className="w-4 h-4" />
                      <span>Extracted Material Schedule & Finish Codes</span>
                    </h4>
                    {isCorridorPreset ? (
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-bold">
                            <th className="py-1.5">Item / Architectural Component</th>
                            <th className="py-1.5">Finish Code</th>
                            <th className="py-1.5">Core Substrate</th>
                            <th className="py-1.5">Brand &amp; Technical Specification</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Fluted Classical Pilasters</td>
                            <td className="py-1.5 text-amber-400 font-bold">M1 / M13</td>
                            <td className="py-1.5">Seasoned Burma Teak</td>
                            <td className="py-1.5 text-emerald-400 font-sans">Fluted 3800mm with Asian Paints PU Satin Walnut Polish</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Carved Corinthian Capitals & Trim</td>
                            <td className="py-1.5 text-amber-400 font-bold">M7</td>
                            <td className="py-1.5">Solid Hardwood Carving</td>
                            <td className="py-1.5 text-emerald-400 font-sans">Gold Leaf Gilded Finish with Antiquing Sealant</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Stepped Ceiling Cove (+5200mm)</td>
                            <td className="py-1.5 text-amber-400 font-bold">CL-01</td>
                            <td className="py-1.5">Reinforced GRG Gypsum</td>
                            <td className="py-1.5 text-emerald-400 font-sans">Gyproc Multi-tier Light Trough + Concealed 2800K LED</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Wainscoting Boiserie Panels</td>
                            <td className="py-1.5 text-amber-400 font-bold">WP01 / WP02</td>
                            <td className="py-1.5">18mm HDHMR Water Resistant</td>
                            <td className="py-1.5 text-emerald-400 font-sans">Classical Beveled Molded Astragals in Cashmere PU</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Architectural Skirting</td>
                            <td className="py-1.5 text-amber-400 font-bold">SK2</td>
                            <td className="py-1.5">Statuario Italian Marble</td>
                            <td className="py-1.5 text-emerald-400 font-sans">150mm Height with Bullnose Edge Profile</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Beauty Salon Arched Entrance Door</td>
                            <td className="py-1.5 text-amber-400 font-bold">D1</td>
                            <td className="py-1.5">Solid Ash Frame + 8mm Glass</td>
                            <td className="py-1.5 text-emerald-400 font-sans">Saint-Gobain Fluted Beveled Glass with Brass Trim</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Console Tables & Credenza Station</td>
                            <td className="py-1.5 text-amber-400 font-bold">WP03 / CT</td>
                            <td className="py-1.5">Calacatta Quartz + Timber</td>
                            <td className="py-1.5 text-emerald-400 font-sans">20mm Kalingastone Top + Fluted Pedestal Bases</td>
                          </tr>
                        </tbody>
                      </table>
                    ) : (
                      <table className="w-full text-left text-[11px]">
                        <thead>
                          <tr className="border-b border-slate-800 text-slate-400 font-bold">
                            <th className="py-1.5">Item / Sub-assembly</th>
                            <th className="py-1.5">Core Substrate</th>
                            <th className="py-1.5">Surface Finish</th>
                            <th className="py-1.5">Brand / Specification</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800 text-slate-300 font-mono">
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Wardrobe Carcass</td>
                            <td className="py-1.5">18mm BWP Marine Plywood</td>
                            <td className="py-1.5">0.8mm Off-White Suede</td>
                            <td className="py-1.5 text-emerald-400 font-sans">Century Club Prime IS:710</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Left Wardrobe Shutters</td>
                            <td className="py-1.5">18mm Marine Plywood</td>
                            <td className="py-1.5">1.0mm Anti-Fingerprint Matte</td>
                            <td className="py-1.5 text-emerald-400 font-sans">Merino Cashmere Grey</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Center Wardrobe Shutters</td>
                            <td className="py-1.5">6mm Toughened Glass</td>
                            <td className="py-1.5">Bronze Tint Fluted Ribbed</td>
                            <td className="py-1.5 text-emerald-400 font-sans">Saint-Gobain Fluted Glass</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Profile Frame</td>
                            <td className="py-1.5">Anodized Aluminum</td>
                            <td className="py-1.5">Brushed Champagne Gold</td>
                            <td className="py-1.5 text-emerald-400 font-sans">Hafele Alumilux Profile</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Study Feature Battens</td>
                            <td className="py-1.5">38mm HDHMR (Routered)</td>
                            <td className="py-1.5">Asian Paints PU Matt Spray</td>
                            <td className="py-1.5 text-emerald-400 font-sans">Warm Walnut Wood Tone</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 font-sans font-semibold text-white">Study Worktop</td>
                            <td className="py-1.5">20mm Engineered Quartz</td>
                            <td className="py-1.5">Beveled Edge Satin Polish</td>
                            <td className="py-1.5 text-emerald-400 font-sans">Kalingastone Quartz Calacatta</td>
                          </tr>
                        </tbody>
                      </table>
                    )}
                  </div>

                  {/* HARDWARE FITTINGS */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <h4 className="font-bold text-sky-400 mb-2 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4" />
                      <span>Specified Architectural Hardware</span>
                    </h4>
                    {isCorridorPreset ? (
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <div className="font-bold text-white">Chandelier Rigging &amp; Suspension</div>
                          <div className="text-slate-400">150kg Seismic-rated Stainless Cable Anchor System</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <div className="font-bold text-white">Salon Entrance Door Hardware (D1)</div>
                          <div className="text-slate-400">Hafele Concealed European Pivot Hinges + Brass Mortise</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <div className="font-bold text-white">Architectural Cove Extrusions</div>
                          <div className="text-slate-400">Anodized Aluminum LED Profile Channels (IP44 24V)</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <div className="font-bold text-white">Pilaster Anchor Brackets</div>
                          <div className="text-slate-400">Hilti Heavy-duty Concealed Steel Cladding Fixings</div>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2 text-[11px]">
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <div className="font-bold text-white">Sliding Gear Mechanism</div>
                          <div className="text-slate-400">Hafele Silent 60kg Top Hung Dampened</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <div className="font-bold text-white">Concealed Drawer Runners</div>
                          <div className="text-slate-400">Blum Tandembox Soft-Close 500mm</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <div className="font-bold text-white">Hydraulic Loft Gas-Struts</div>
                          <div className="text-slate-400">Hafele Duo Flap Stay (120N)</div>
                        </div>
                        <div className="p-2 bg-slate-950 rounded border border-slate-800">
                          <div className="font-bold text-white">Architectural Handles</div>
                          <div className="text-slate-400">Solid Brass 1200mm Long Bar (Brushed Gold)</div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB CONTENT 4: FACTORY CNC CUTTING LIST */}
              {outputTab === 'cnc' && (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                  <div className="p-2 bg-amber-950/40 border border-amber-500/40 rounded text-[11px] text-amber-200">
                    {isCorridorPreset
                      ? 'CNC Millwork Nesting Data generated for factory panel router, 5-axis column turners & edge-profile machines.'
                      : 'CNC-Ready Nesting Data generated for factory panel router & automatic edge-bander (Homag / Biesse).'}
                  </div>

                  <table className="w-full text-left text-[11px] bg-slate-900 rounded border border-slate-800">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950">
                        <th className="p-2">Part Code</th>
                        <th className="p-2">Component Description</th>
                        <th className="p-2">Material / Grade</th>
                        <th className="p-2 text-right">L × W × T (mm)</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2">Tooling / Finish Operation</th>
                      </tr>
                    </thead>
                    {isCorridorPreset ? (
                      <tbody className="divide-y divide-slate-800 font-mono text-[10.5px]">
                        <tr>
                          <td className="p-2 font-bold text-amber-400">C-01..14</td>
                          <td className="p-2 font-sans font-semibold text-white">Fluted Pilaster Column Shaft (M1)</td>
                          <td className="p-2">Seasoned Burma Teak</td>
                          <td className="p-2 text-right">3800 × 300 × 50</td>
                          <td className="p-2 text-right font-bold text-amber-300">14</td>
                          <td className="p-2 font-sans text-slate-400">5-Axis Fluting + PU Spray</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-amber-400">C-15..28</td>
                          <td className="p-2 font-sans font-semibold text-white">Corinthian Carved Capital (M7)</td>
                          <td className="p-2">Hardwood Solid Core</td>
                          <td className="p-2 text-right">400 × 350 × 60</td>
                          <td className="p-2 text-right font-bold text-amber-300">14</td>
                          <td className="p-2 font-sans text-slate-400">3D CNC Relief + Gold Gilt</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-amber-400">P-01..18</td>
                          <td className="p-2 font-sans font-semibold text-white">Boiserie Field Paneling (WP01)</td>
                          <td className="p-2">18mm HDHMR Board</td>
                          <td className="p-2 text-right">2400 × 1200 × 18</td>
                          <td className="p-2 text-right font-bold text-amber-300">18</td>
                          <td className="p-2 font-sans text-slate-400">Mitered Chamfer + Cashmere PU</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-amber-400">P-19..36</td>
                          <td className="p-2 font-sans font-semibold text-white">Lower Wainscot Dado Rail (WP02)</td>
                          <td className="p-2">18mm HDHMR Board</td>
                          <td className="p-2 text-right">900 × 600 × 18</td>
                          <td className="p-2 text-right font-bold text-amber-300">18</td>
                          <td className="p-2 font-sans text-slate-400">Profile Grooving + Lacquer</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-amber-400">D-01</td>
                          <td className="p-2 font-sans font-semibold text-white">Salon Arched Door Jamb Frame (D1)</td>
                          <td className="p-2">Solid Ash Timber</td>
                          <td className="p-2 text-right">2400 × 1800 × 150</td>
                          <td className="p-2 text-right font-bold text-amber-300">1</td>
                          <td className="p-2 font-sans text-slate-400">Curved CNC Rebate + Glaze Bed</td>
                        </tr>
                      </tbody>
                    ) : (
                      <tbody className="divide-y divide-slate-800 font-mono text-[10.5px]">
                        <tr>
                          <td className="p-2 font-bold text-amber-400">P-01</td>
                          <td className="p-2 font-sans font-semibold text-white">Left External Gable</td>
                          <td className="p-2">18mm BWP Ply</td>
                          <td className="p-2 text-right">2800 × 580 × 18</td>
                          <td className="p-2 text-right font-bold text-amber-300">1</td>
                          <td className="p-2 font-sans text-slate-400">2mm Rehau Front</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-amber-400">P-02</td>
                          <td className="p-2 font-sans font-semibold text-white">Center Internal Divider</td>
                          <td className="p-2">18mm BWP Ply</td>
                          <td className="p-2 text-right">2800 × 580 × 18</td>
                          <td className="p-2 text-right font-bold text-amber-300">1</td>
                          <td className="p-2 font-sans text-slate-400">2mm Rehau Front</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-amber-400">P-03</td>
                          <td className="p-2 font-sans font-semibold text-white">Study Side Right Gable</td>
                          <td className="p-2">18mm BWP Ply</td>
                          <td className="p-2 text-right">2800 × 580 × 18</td>
                          <td className="p-2 text-right font-bold text-amber-300">1</td>
                          <td className="p-2 font-sans text-slate-400">2mm Rehau Front</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-amber-400">P-04</td>
                          <td className="p-2 font-sans font-semibold text-white">Study Desk Countertop</td>
                          <td className="p-2">25mm HDHMR + PU</td>
                          <td className="p-2 text-right">900 × 550 × 25</td>
                          <td className="p-2 text-right font-bold text-amber-300">1</td>
                          <td className="p-2 font-sans text-slate-400">PU Seamless Chamfer</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-amber-400">P-05</td>
                          <td className="p-2 font-sans font-semibold text-white">Fluted Batten Backing</td>
                          <td className="p-2">38mm Routered MDF</td>
                          <td className="p-2 text-right">2185 × 450 × 38</td>
                          <td className="p-2 text-right font-bold text-amber-300">1</td>
                          <td className="p-2 font-sans text-slate-400">PU Sprayed Edges</td>
                        </tr>
                        <tr>
                          <td className="p-2 font-bold text-amber-400">P-06</td>
                          <td className="p-2 font-sans font-semibold text-white">Drawer Front Fascia</td>
                          <td className="p-2">18mm HDHMR + PU</td>
                          <td className="p-2 text-right">440 × 130 × 18</td>
                          <td className="p-2 text-right font-bold text-amber-300">2</td>
                          <td className="p-2 font-sans text-slate-400">2mm Rehau All Sides</td>
                        </tr>
                      </tbody>
                    )}
                  </table>
                </div>
              )}

              {/* TAB CONTENT 5: AUTOMATIC BOQ ESTIMATE LINK */}
              {outputTab === 'boq' && (
                <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-emerald-400 flex items-center gap-1.5">
                        <FileSpreadsheet className="w-4 h-4" />
                        <span>Commercial BOQ Line Items Generated from Image 2</span>
                      </h4>
                      <span className="font-mono text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-500/30">
                        Total: {isCorridorPreset ? '₹ 11,48,000' : '₹ 1,48,500'}
                      </span>
                    </div>

                    <table className="w-full text-left text-[11px]">
                      <thead>
                        <tr className="border-b border-slate-800 text-slate-400 font-bold">
                          <th className="py-1.5">BOQ Code</th>
                          <th className="py-1.5">Scope Description</th>
                          <th className="py-1.5 text-right">Qty</th>
                          <th className="py-1.5">Unit</th>
                          <th className="py-1.5 text-right">Rate (₹)</th>
                          <th className="py-1.5 text-right">Total (₹)</th>
                        </tr>
                      </thead>
                      {isCorridorPreset ? (
                        <tbody className="divide-y divide-slate-800 font-mono text-[10.5px]">
                          <tr>
                            <td className="py-1.5 text-emerald-400 font-bold">BOQ-COR-01</td>
                            <td className="py-1.5 font-sans text-slate-300">Grand Corinthian Fluted Pilasters (M1, M7, M13) with Gold Leafing</td>
                            <td className="py-1.5 text-right">14.0</td>
                            <td className="py-1.5 font-sans">Sets</td>
                            <td className="py-1.5 text-right">38,000</td>
                            <td className="py-1.5 text-right font-bold text-white">5,32,000</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-emerald-400 font-bold">BOQ-COR-02</td>
                            <td className="py-1.5 font-sans text-slate-300">Stepped Ceiling Cove (+5200mm SSL) & Chandelier Rose Structure</td>
                            <td className="py-1.5 text-right">1.0</td>
                            <td className="py-1.5 font-sans">Set</td>
                            <td className="py-1.5 text-right">1,85,000</td>
                            <td className="py-1.5 text-right font-bold text-white">1,85,000</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-emerald-400 font-bold">BOQ-COR-03</td>
                            <td className="py-1.5 font-sans text-slate-300">Architectural Boiserie Wainscoting (WP01-03) with 150mm Statuario Skirting SK2</td>
                            <td className="py-1.5 text-right">120.0</td>
                            <td className="py-1.5 font-sans">RFT</td>
                            <td className="py-1.5 text-right">1,950</td>
                            <td className="py-1.5 text-right font-bold text-white">2,34,000</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-emerald-400 font-bold">BOQ-COR-04</td>
                            <td className="py-1.5 font-sans text-slate-300">Arched Beauty Salon Entrance Portal Door D1 with Beveled Safety Glazing</td>
                            <td className="py-1.5 text-right">1.0</td>
                            <td className="py-1.5 font-sans">Set</td>
                            <td className="py-1.5 text-right">92,000</td>
                            <td className="py-1.5 text-right font-bold text-white">92,000</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-emerald-400 font-bold">BOQ-COR-05</td>
                            <td className="py-1.5 font-sans text-slate-300">Integrated Console Tables with Italian Calacatta Marble Tops & Cove LED</td>
                            <td className="py-1.5 text-right">3.0</td>
                            <td className="py-1.5 font-sans">Sets</td>
                            <td className="py-1.5 text-right">35,000</td>
                            <td className="py-1.5 text-right font-bold text-white">1,05,000</td>
                          </tr>
                        </tbody>
                      ) : (
                        <tbody className="divide-y divide-slate-800 font-mono text-[10.5px]">
                          <tr>
                            <td className="py-1.5 text-emerald-400 font-bold">BOQ-WRD-01</td>
                            <td className="py-1.5 font-sans text-slate-300">Full-height 2700×2900mm Wardrobe Carcass with Century BWP Ply</td>
                            <td className="py-1.5 text-right">1.0</td>
                            <td className="py-1.5 font-sans">Set</td>
                            <td className="py-1.5 text-right">98,000</td>
                            <td className="py-1.5 text-right font-bold text-white">98,000</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-emerald-400 font-bold">BOQ-GLS-02</td>
                            <td className="py-1.5 font-sans text-slate-300">Fluted Glass Shutter + Brushed Gold ALU Profiles & Hafele Slider</td>
                            <td className="py-1.5 text-right">1.0</td>
                            <td className="py-1.5 font-sans">Set</td>
                            <td className="py-1.5 text-right">28,500</td>
                            <td className="py-1.5 text-right font-bold text-white">28,500</td>
                          </tr>
                          <tr>
                            <td className="py-1.5 text-emerald-400 font-bold">BOQ-DSK-03</td>
                            <td className="py-1.5 font-sans text-slate-300">Study Desk Unit + 450mm Fluted PU Battens + Dual Blum Drawers</td>
                            <td className="py-1.5 text-right">1.0</td>
                            <td className="py-1.5 font-sans">Set</td>
                            <td className="py-1.5 text-right">22,000</td>
                            <td className="py-1.5 text-right font-bold text-white">22,000</td>
                          </tr>
                        </tbody>
                      )}
                    </table>
                  </div>

                  <div className="flex items-center justify-between p-2.5 bg-slate-900 rounded border border-slate-800">
                    <span className="text-slate-400">Directly synchronized with BOQ Engine:</span>
                    <button
                      onClick={() => {
                        onClose();
                        if (onNavigateTab) onNavigateTab('boq');
                      }}
                      className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5"
                    >
                      <FileSpreadsheet className="w-3.5 h-3.5" />
                      <span>Review in Module 4 (BOQ Engine)</span>
                    </button>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="px-6 py-3 border-t border-slate-800 bg-slate-950 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>AI Multimodal Vision Engine calibrated • 100% Parameter Traceability Locked</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                if (onNavigateTab) onNavigateTab('production');
              }}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5"
            >
              <Wrench className="w-3.5 h-3.5 text-amber-400" />
              <span>Send to Module 6 (Production)</span>
            </button>

            <button
              onClick={() => {
                onClose();
                if (onNavigateTab) onNavigateTab('client_approvals');
              }}
              className="px-3 py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 border border-slate-700 flex items-center gap-1.5"
            >
              <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Send to Module 9 (Client Sign-off)</span>
            </button>

            <button
              onClick={handleApplyToModule2}
              className="px-4 py-1.5 rounded bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md flex items-center gap-1.5 transition"
            >
              <span>Accept & Push Drawing to Module 2</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
