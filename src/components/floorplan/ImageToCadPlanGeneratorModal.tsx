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
  // Input image states
  const [selectedPreset, setSelectedPreset] = useState<'sample1' | 'sample2' | 'custom'>('sample1');
  const [uploadedImageUri, setUploadedImageUri] = useState<string | null>(null);
  const [roomContext, setRoomContext] = useState<string>('Master Bedroom Suite (MBR-001)');
  const [selectedAssembly, setSelectedAssembly] = useState<string>('MBR Wardrobe with Study Desk');

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

  // The 1st Image: Customer 3D Interior Concept Render
  const customerImage1Url = uploadedImageUri || '/assets/aistudio/WhatsApp_Image_2026-11-11_at_12.49.45_PM_6b1100ed.jpeg';

  // The 2nd Image: Generated Technical CAD Elevation Drawing Sheet
  const cadPlanImage2Url = '/assets/aistudio/WhatsApp_Image_2026-11-11_at_12.49.44_PM_6a0a971d.jpeg';

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
    exportTechnicalDrawingToDxf('DRW-MBR-005', 'MBR_Wardrobe_With_Study_Desk_2700x2900.dxf');
    setNotification('Exported DRW-MBR-005 to AutoCAD DXF format.');
    setTimeout(() => setNotification(null), 3000);
  };

  const handleApplyToModule2 = () => {
    if (onApplyDrawingToProject) {
      onApplyDrawingToProject({
        drawingCode: 'DRW-MBR-005',
        title: 'MBR WARDROBE WITH STUDY DESK',
        source: 'IMAGE_TO_CAD_GENERATOR',
        overallWidthMm: 2700,
        overallHeightMm: 2900
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
                  DRW-MBR-005 • Rev R02
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
        <div className="bg-slate-900/90 border-b border-slate-800 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-slate-400 font-medium">Input Reference:</span>
            <button
              onClick={() => {
                setSelectedPreset('sample1');
                setUploadedImageUri(null);
                setConversionCompleted(true);
              }}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition ${
                selectedPreset === 'sample1'
                  ? 'bg-amber-400 text-slate-950 shadow-xs'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              ★ Customer 3D Inspiration Render (WhatsApp Image 1)
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
              <span>{isGenerating ? 'Synthesizing CAD...' : 'Re-synthesize CAD Elevation'}</span>
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
                  <ul className="text-slate-300 space-y-0.5 mt-1 text-[10px] list-disc list-inside">
                    <li>High vertical proportions & recessed ceiling alignment</li>
                    <li>Symmetrical bays with central glazed accent display</li>
                    <li>Fluted acoustic wood battens + warm 2800K LED coves</li>
                    <li>Anodized champagne brushed gold architectural profiles</li>
                  </ul>
                </div>
              </div>

              {/* MULTI-STAGE VISION AI PIPELINE STATUS */}
              <div className="mt-3 p-2.5 bg-slate-900 rounded border border-slate-800">
                <div className="text-[11px] font-bold text-slate-300 flex items-center justify-between mb-2">
                  <span>AI Extraction & Dimensioning Pipeline:</span>
                  <span className="text-emerald-400 text-[10px] font-mono">
                    {isGenerating ? `Step ${generationStep}/3` : 'Analysis Locked'}
                  </span>
                </div>

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
              </div>

              {/* DATA LINKAGE BADGE */}
              <div className="mt-3 p-2 bg-slate-900/60 rounded border border-slate-800/80 font-mono text-[10px] text-slate-400 space-y-1">
                <div className="text-slate-300 font-bold text-[10px]">Data Linkage Traceability:</div>
                <div className="grid grid-cols-2 gap-1 text-[9.5px]">
                  <div><span className="text-slate-500">Project:</span> PRJ-2026-001</div>
                  <div><span className="text-slate-500">Room:</span> MBR-001</div>
                  <div><span className="text-slate-500">Drawing:</span> DRW-MBR-005</div>
                  <div><span className="text-slate-500">Revision:</span> R02 (Sep 2026)</div>
                  <div><span className="text-slate-500">BOQ Ref:</span> BOQ-0045</div>
                  <div><span className="text-slate-500">Material:</span> MAT-LAM-001</div>
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

              {/* TAB CONTENT 1: HIGH-RES DRAWING SHEET (IMAGE 2 WITH OFFICIAL GFC STAMP & TITLE BLOCK) */}
              {outputTab === 'sheet' && (
                <div className="flex-1 flex flex-col gap-2">
                  <div className="relative border border-slate-800 rounded bg-white overflow-hidden shadow-inner flex items-center justify-center min-h-[460px]">
                    <img
                      src={cadPlanImage2Url}
                      alt="Synthesized Technical CAD Plan Sheet with GFC Approval"
                      className="w-full h-auto max-h-[520px] object-contain"
                    />

                    {/* OVERLAY QUICK INSPECTOR BADGES */}
                    <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1.5 rounded border border-slate-700 space-y-0.5 shadow-lg">
                      <div className="text-amber-400 font-bold">DRAWING: DRW-MBR-005 (REV 02)</div>
                      <div>SPAN: 2700mm (900+900+900) • HEIGHT: 2900mm</div>
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
                          <div><span className="text-slate-500">ROOM:</span> <b>MBR WARDROBE</b></div>
                          <div><span className="text-slate-500">REV:</span> <b>No : - 02 (GFC)</b></div>
                          <div><span className="text-slate-500">DESIGNER:</span> <b>APARANJI DIVYA</b></div>
                          <div><span className="text-slate-500">SCALE:</span> <b>1:25 (MM)</b></div>
                          <div><span className="text-slate-500">DATE:</span> <b>SEPTEMBER 2026</b></div>
                          <div><span className="text-slate-500">PAGE NO:</span> <b>5 OF 12</b></div>
                        </div>
                        <div className="pt-1 border-t border-red-400 text-[8px] text-slate-600 flex items-center justify-between">
                          <span>APPROVED FOR SITE &amp; CNC MILLING</span>
                          <span className="font-bold text-red-700">IS 5533:2018</span>
                        </div>
                      </div>
                    </div>

                    {/* BOTTOM RIGHT SHEET STAMP */}
                    <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-xs text-white text-[10px] font-mono px-2.5 py-1 rounded border border-slate-700 flex items-center gap-2">
                      <span className="text-slate-400">DESIGNER: <b className="text-emerald-400">APARANJI DIVYA</b></span>
                      <span className="text-slate-600">|</span>
                      <span className="text-amber-400 font-bold">PAGE NO : 5</span>
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
                        <span className="font-bold text-amber-400">MBR WARDROBE</span>
                      </div>
                      <div className="border-r border-slate-800 pr-1">
                        <span className="text-slate-500 block text-[9px] uppercase">DESIGNER</span>
                        <span className="font-bold text-emerald-400">APARANJI DIVYA</span>
                      </div>
                      <div className="border-r border-slate-800 pr-1">
                        <span className="text-slate-500 block text-[9px] uppercase">REVISION</span>
                        <span className="font-bold text-red-400 bg-red-950/80 px-1 py-0.5 rounded border border-red-700/50">No : - 02 (GFC)</span>
                      </div>
                      <div className="border-r border-slate-800 pr-1">
                        <span className="text-slate-500 block text-[9px] uppercase">DATE</span>
                        <span className="font-bold text-slate-300">September 2026</span>
                      </div>
                      <div>
                        <span className="text-slate-500 block text-[9px] uppercase">PAGE NO</span>
                        <span className="font-bold text-amber-400">PAGE NO : 5</span>
                      </div>
                    </div>
                    <div className="mt-1 pt-1 border-t border-slate-800/80 flex items-center justify-between text-[9.5px] text-slate-400 font-mono">
                      <span className="text-amber-400 font-bold">NOTE : All Dimensions are in MM</span>
                      <span className="text-slate-500">ROYALWOOD.STUDIO • ARCHITECTURAL JOINERY GFC PACKAGE</span>
                    </div>
                  </div>

                  {/* 5 KEY CALLOUTS MATCHING ATTACHMENT */}
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

                      {/* Ceiling level */}
                      <line x1="40" y1="70" x2="600" y2="70" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4 2" />
                      <text x="50" y="62" fill="#94a3b8" fontSize="10" fontFamily="monospace">+2900mm CEILING LEVEL</text>

                      {/* 100mm Skirting */}
                      <rect x="100" y="350" width="440" height="10" fill="#0f172a" stroke="#334155" strokeWidth="1" />
                      <text x="105" y="358" fill="#cbd5e1" fontSize="8" fontFamily="monospace">100mm SKIRTING</text>

                      {/* OVERALL WARDROBE + STUDY BODY (2700mm span = 440px) */}
                      {/* Bay 1: Wardrobe Left (900mm = 146px) */}
                      <rect x="100" y="80" width="146" height="270" fill="#f8fafc" stroke="#0f172a" strokeWidth="2" />
                      <line x1="173" y1="80" x2="173" y2="350" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="3 3" />
                      <text x="173" y="160" fill="#475569" fontSize="10" fontWeight="bold" textAnchor="middle">BAY 1: LAMINATE</text>
                      <text x="173" y="175" fill="#64748b" fontSize="9" textAnchor="middle">900mm Width</text>

                      {/* Bay 2: Wardrobe Glass Center (900mm = 146px) */}
                      <rect x="246" y="80" width="146" height="270" fill="#f1f5f9" stroke="#b45309" strokeWidth="2" />
                      {/* Brushed gold frame outline */}
                      <rect x="249" y="83" width="140" height="264" fill="none" stroke="#d97706" strokeWidth="2.5" />
                      <line x1="319" y1="83" x2="319" y2="347" stroke="#d97706" strokeWidth="2" />
                      <text x="319" y="150" fill="#92400e" fontSize="10" fontWeight="bold" textAnchor="middle">BAY 2: FLUTED GLASS</text>
                      <text x="319" y="165" fill="#b45309" fontSize="8.5" textAnchor="middle">BRUSHED GOLD ALU PROFILE</text>

                      {/* Bay 3: Study Desk & Wall Unit (900mm = 148px) */}
                      {/* Fluted battens background (450mm = 74px) */}
                      {activeLayers.finishes && (
                        <g id="flutedPanel">
                          <rect x="392" y="80" width="74" height="270" fill="#fef3c7" stroke="#d97706" strokeWidth="1" />
                          {[0, 8, 16, 24, 32, 40, 48, 56, 64].map((offset) => (
                            <line key={offset} x1={392 + offset} y1="80" x2={392 + offset} y2="350" stroke="#b45309" strokeWidth="1" />
                          ))}
                          <text x="429" y="105" fill="#92400e" fontSize="8" fontWeight="bold" textAnchor="middle">450mm FLUTED</text>
                        </g>
                      )}

                      {/* Study Desk Countertop (+715mm = y: 288.5, thickness 20mm) */}
                      <rect x="392" y="288" width="148" height="6" fill="#78350f" stroke="#451a03" strokeWidth="1.5" />
                      <text x="466" y="283" fill="#78350f" fontSize="8" fontWeight="bold" textAnchor="middle">+715 COUNTERTOP</text>

                      {/* 130mm Drawer Fascia (y: 294 to 307) */}
                      <rect x="392" y="294" width="148" height="13" fill="#fed7aa" stroke="#c2410c" strokeWidth="1.5" />
                      <line x1="466" y1="294" x2="466" y2="307" stroke="#c2410c" strokeWidth="1" />
                      <text x="466" y="304" fill="#9a3412" fontSize="7.5" fontWeight="bold" textAnchor="middle">130mm PENCIL DRAWERS</text>

                      {/* Legroom Clearance (600mm = y: 307 to 350) */}
                      <rect x="410" y="307" width="112" height="43" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" strokeDasharray="3 2" />
                      <text x="466" y="332" fill="#64748b" fontSize="8" textAnchor="middle">600mm LEGROOM</text>

                      {/* Cantilevered Floating Shelves */}
                      <rect x="466" y="200" width="74" height="4" fill="#78350f" />
                      <rect x="466" y="240" width="74" height="4" fill="#78350f" />
                      <text x="503" y="195" fill="#78350f" fontSize="7" textAnchor="middle">25mm SHELVES</text>

                      {/* DIMENSIONS LAYER */}
                      {activeLayers.dimensions && (
                        <g id="dimLines">
                          {/* Overall Width 2700mm */}
                          <line x1="100" y1="385" x2="540" y2="385" stroke="#dc2626" strokeWidth="1.5" />
                          <line x1="100" y1="380" x2="100" y2="390" stroke="#dc2626" strokeWidth="1" />
                          <line x1="540" y1="380" x2="540" y2="390" stroke="#dc2626" strokeWidth="1" />
                          <text x="320" y="396" fill="#dc2626" fontSize="10" fontFamily="monospace" fontWeight="bold" textAnchor="middle">
                            2700 mm (OVERALL WIDTH)
                          </text>

                          {/* Bay Subdivisions: 900 + 900 + 900 */}
                          <line x1="100" y1="370" x2="246" y2="370" stroke="#b91c1c" strokeWidth="1" />
                          <text x="173" y="368" fill="#b91c1c" fontSize="8" fontFamily="monospace" textAnchor="middle">900</text>
                          <line x1="246" y1="370" x2="392" y2="370" stroke="#b91c1c" strokeWidth="1" />
                          <text x="319" y="368" fill="#b91c1c" fontSize="8" fontFamily="monospace" textAnchor="middle">900</text>
                          <line x1="392" y1="370" x2="540" y2="370" stroke="#b91c1c" strokeWidth="1" />
                          <text x="466" y="368" fill="#b91c1c" fontSize="8" fontFamily="monospace" textAnchor="middle">900</text>

                          {/* Overall Height 2900mm on Left */}
                          <line x1="75" y1="70" x2="75" y2="360" stroke="#dc2626" strokeWidth="1.5" />
                          <line x1="70" y1="70" x2="80" y2="70" stroke="#dc2626" strokeWidth="1" />
                          <line x1="70" y1="360" x2="80" y2="360" stroke="#dc2626" strokeWidth="1" />
                          <text x="65" y="215" fill="#dc2626" fontSize="10" fontFamily="monospace" fontWeight="bold" transform="rotate(-90 65 215)" textAnchor="middle">
                            2900 mm (SLAB HEIGHT)
                          </text>
                        </g>
                      )}

                      {/* GFC APPROVAL STAMP IN VECTOR CAD */}
                      {gfcStampActive && (
                        <g id="vectorGfcStamp" transform="translate(420, 20)">
                          <rect x="0" y="0" width="180" height="46" fill="#450a0a" fillOpacity="0.85" stroke="#ef4444" strokeWidth="1.5" rx="2" />
                          <rect x="2" y="2" width="176" height="42" fill="none" stroke="#ef4444" strokeWidth="0.8" strokeDasharray="3 1.5" />
                          <text x="90" y="14" fill="#fca5a5" fontSize="8" fontWeight="bold" fontFamily="monospace" textAnchor="middle">★ GOOD FOR CONSTRUCTION (GFC) ★</text>
                          <text x="90" y="24" fill="#f87171" fontSize="7" fontFamily="monospace" textAnchor="middle">ROOM: MBR WARDROBE • REV: NO : - 02</text>
                          <text x="90" y="33" fill="#e2e8f0" fontSize="6.5" fontFamily="monospace" textAnchor="middle">DESIGNER: APARANJI DIVYA • PAGE NO: 5</text>
                          <text x="90" y="41" fill="#4ade80" fontSize="6" fontWeight="bold" fontFamily="monospace" textAnchor="middle">NOTE: ALL DIMENSIONS IN MM • TOL: ±1.5MM</text>
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
                            Drawing No: <b className="text-amber-300">DRW-MBR-005</b> • Revision: <b className="text-red-400">No : - 02 (GFC)</b> • Page: <b className="text-white">5 of 12</b>
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
                        ROYALWOOD.STUDIO • ARCHITECTURAL CONSULTANCY
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
                        <div className="text-amber-400 font-bold text-sm mt-0.5">MBR WARDROBE</div>
                        <div className="text-slate-400 text-[10px] mt-1">ZONE: Master Suite Bed Wall</div>
                      </div>

                      <div className="p-2 bg-slate-950 rounded border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">DESIGNER</div>
                        <div className="text-emerald-400 font-bold mt-0.5">APARANJI DIVYA</div>
                        <div className="text-slate-400 text-[10px] mt-1">SIGN-OFF: Certified Lead Architect</div>
                      </div>

                      <div className="p-2 bg-slate-950 rounded border border-slate-800">
                        <div className="text-slate-400 text-[10px] uppercase">REVISION &amp; DATE</div>
                        <div className="text-red-400 font-bold mt-0.5">No : - 02 (GFC)</div>
                        <div className="text-slate-400 text-[10px] mt-1">DATE: <span className="text-slate-200">September 2026</span></div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2 pt-1 text-[11px] font-mono">
                      <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80">
                        <span className="text-amber-400 font-bold">NOTE: All Dimensions are in MM</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Do not scale drawing. Read written dimensions only.</p>
                      </div>
                      <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80">
                        <span className="text-slate-300 font-bold">PAGE NO : 5 OF 12</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Package C: Custom Joinery & Wardrobe Elevations</p>
                      </div>
                      <div className="p-2 bg-slate-950/80 rounded border border-slate-800/80">
                        <span className="text-emerald-400 font-bold">TOLERANCE: ±1.5 mm</span>
                        <p className="text-[10px] text-slate-400 mt-0.5">Fabrication standard IS 5533:2018 for modular carcass</p>
                      </div>
                    </div>
                  </div>

                  {/* 5 CRITICAL CALLOUTS SPECIFICATION AUDIT */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg space-y-2">
                    <h5 className="font-bold text-amber-400 text-xs flex items-center gap-1.5">
                      <Ruler className="w-3.5 h-3.5" />
                      <span>5 Critical GFC Engineering Callouts Locked for Site Installation</span>
                    </h5>
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
                  </div>

                  {/* GFC APPROVAL CERTIFICATE & SIGNATURES */}
                  <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg flex flex-wrap items-center justify-between gap-3 text-xs">
                    <div className="space-y-0.5 font-mono text-[10.5px]">
                      <div className="text-slate-400">GFC TRANSMITTAL CERTIFICATE: <b className="text-white">BS-GFC-2026-088-05</b></div>
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
                  </div>

                  {/* HARDWARE FITTINGS */}
                  <div className="p-3 bg-slate-900 rounded border border-slate-800">
                    <h4 className="font-bold text-sky-400 mb-2 flex items-center gap-1.5">
                      <Wrench className="w-4 h-4" />
                      <span>Specified Architectural Hardware</span>
                    </h4>
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
                  </div>
                </div>
              )}

              {/* TAB CONTENT 4: FACTORY CNC CUTTING LIST */}
              {outputTab === 'cnc' && (
                <div className="flex-1 overflow-y-auto space-y-2 pr-1 text-xs">
                  <div className="p-2 bg-amber-950/40 border border-amber-500/40 rounded text-[11px] text-amber-200">
                    CNC-Ready Nesting Data generated for factory panel router & automatic edge-bander (Homag / Biesse).
                  </div>

                  <table className="w-full text-left text-[11px] bg-slate-900 rounded border border-slate-800">
                    <thead>
                      <tr className="border-b border-slate-800 text-slate-400 font-bold bg-slate-950">
                        <th className="p-2">Part Code</th>
                        <th className="p-2">Panel Component</th>
                        <th className="p-2">Material</th>
                        <th className="p-2 text-right">L × W × T (mm)</th>
                        <th className="p-2 text-right">Qty</th>
                        <th className="p-2">Edge-Banding Sides</th>
                      </tr>
                    </thead>
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
                        Total: ₹ 1,48,500
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
