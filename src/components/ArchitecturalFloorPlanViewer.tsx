import React, { useState, useMemo } from 'react';
import { 
  Maximize2, 
  Minimize2, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Compass, 
  Ruler, 
  Download, 
  Printer, 
  Eye, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  Info,
  FileCode,
  FileImage,
  FileSpreadsheet,
  Palette,
  Check,
  Flame,
  Droplets,
  Mountain,
  Wind,
  Sun
} from 'lucide-react';
import { VastuLayoutOption, VastuRoomSuggestion, ProjectRecord } from '../types/erp';
import { 
  generateFloorPlanSvg, 
  downloadFloorPlanSvg, 
  downloadFloorPlanPng, 
  downloadFloorPlanSpecificationJson,
  formatFtIn
} from '../utils/floorPlanSvgGenerator';
import {
  downloadCadFile,
  generateCadZipBundle,
  generateDxfContent,
  generateStepContent,
  generateStlContent,
  CadFileExtension,
  CadExportOptions
} from '../utils/cadExportGenerator';
import { Box, Code2, Cpu, HardDrive, PackageCheck, Sliders, ChevronDown } from 'lucide-react';

// High-resolution architectural CAD plan assets generated for initial reference
import classicalVastuPlanImg from '../assets/images/floorplan_classical_vastu_1790415154125.jpg';
import biophilicCourtyardPlanImg from '../assets/images/floorplan_biophilic_courtyard_1790415168195.jpg';
import executiveSuitePlanImg from '../assets/images/floorplan_executive_suite_1790415181606.jpg';

interface ArchitecturalFloorPlanViewerProps {
  layoutOption: VastuLayoutOption;
  project?: ProjectRecord | null;
  onApplyLayout?: (option: VastuLayoutOption) => void;
  isApplied?: boolean;
}

export const ArchitecturalFloorPlanViewer: React.FC<ArchitecturalFloorPlanViewerProps> = ({
  layoutOption,
  project,
  onApplyLayout,
  isApplied
}) => {
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showDimensions, setShowDimensions] = useState<boolean>(true);
  const [showVastuOverlay, setShowVastuOverlay] = useState<boolean>(true);
  const [showFurniture, setShowFurniture] = useState<boolean>(true);
  const [showTitleBlock, setShowTitleBlock] = useState<boolean>(true);
  const [activeViewMode, setActiveViewMode] = useState<'cad_dynamic' | 'split' | 'reference_render'>('cad_dynamic');
  const [cadTheme, setCadTheme] = useState<'cad_blueprint' | 'drafting_white' | 'vastu_heatmap'>('cad_blueprint');
  const [selectedRoom, setSelectedRoom] = useState<VastuRoomSuggestion | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [downloadSuccessMessage, setDownloadSuccessMessage] = useState<string | null>(null);
  const [isExportingPng, setIsExportingPng] = useState<boolean>(false);

  // CAD Multi-Format Extraction State (.dwg, .dxf, .step, .stl)
  const [isCadModalOpen, setIsCadModalOpen] = useState<boolean>(false);
  const [cadUnitSystem, setCadUnitSystem] = useState<'imperial_feet' | 'metric_mm'>('imperial_feet');
  const [cadWallHeightFt, setCadWallHeightFt] = useState<number>(10.0);
  const [cadIncludeDimensions, setCadIncludeDimensions] = useState<boolean>(true);
  const [cadIncludeVastuGrid, setCadIncludeVastuGrid] = useState<boolean>(true);
  const [cadActiveTab, setCadActiveTab] = useState<'formats' | 'preview'>('formats');
  const [cadPreviewFormat, setCadPreviewFormat] = useState<'dxf' | 'step' | 'stl' | 'dwg'>('dxf');
  const [isPackagingZip, setIsPackagingZip] = useState<boolean>(false);

  const plotWidth = layoutOption.plotDimensions?.widthFt || (layoutOption.totalBuiltUpSqFt === 1200 ? 30 : Math.round(Math.sqrt(layoutOption.totalBuiltUpSqFt * 0.75)));
  const plotDepth = layoutOption.plotDimensions?.depthFt || (layoutOption.totalBuiltUpSqFt === 1200 ? 40 : Math.round(layoutOption.totalBuiltUpSqFt / plotWidth));

  // Dynamically generate the SVG markup representing the current exact specifications
  const dynamicSvgMarkup = useMemo(() => {
    return generateFloorPlanSvg(layoutOption, {
      theme: cadTheme,
      showDimensions,
      showVastuOverlay,
      showFurniture,
      showTitleBlock,
      projectName: project?.title || 'Turnkey Architectural Project',
      clientName: project?.clientName || 'Client Presentation'
    });
  }, [layoutOption, cadTheme, showDimensions, showVastuOverlay, showFurniture, showTitleBlock, project]);

  // Static reference image for comparison
  const getFloorPlanImage = (optionNum: 1 | 2 | 3): string => {
    switch (optionNum) {
      case 1:
        return classicalVastuPlanImg;
      case 2:
        return biophilicCourtyardPlanImg;
      case 3:
        return executiveSuitePlanImg;
      default:
        return classicalVastuPlanImg;
    }
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  const showNotification = (msg: string) => {
    setDownloadSuccessMessage(msg);
    setTimeout(() => setDownloadSuccessMessage(null), 4000);
  };

  // Handlers for exporting the fresh file
  const handleDownloadSvg = () => {
    downloadFloorPlanSvg(layoutOption, {
      theme: cadTheme,
      showDimensions,
      showVastuOverlay,
      showFurniture,
      showTitleBlock,
      projectName: project?.title,
      clientName: project?.clientName
    });
    showNotification(`Fresh Vector CAD Blueprint (.SVG) downloaded for ${plotWidth}' × ${plotDepth}'!`);
  };

  const handleDownloadPng = async () => {
    try {
      setIsExportingPng(true);
      await downloadFloorPlanPng(layoutOption, {
        theme: cadTheme,
        showDimensions,
        showVastuOverlay,
        showFurniture,
        showTitleBlock,
        projectName: project?.title,
        clientName: project?.clientName
      });
      showNotification(`High-Resolution Presentation Blueprint (.PNG) downloaded!`);
    } catch (err: any) {
      console.error('PNG export failed:', err);
      showNotification('Export failed. Downloading SVG file instead...');
      handleDownloadSvg();
    } finally {
      setIsExportingPng(false);
    }
  };

  const handleDownloadScheduleJson = () => {
    downloadFloorPlanSpecificationJson(layoutOption);
    showNotification(`Architectural Schedule & Vastu Specification (.JSON) downloaded!`);
  };

  const cadOptions: CadExportOptions = useMemo(() => ({
    unitSystem: cadUnitSystem,
    wallHeightFt: cadWallHeightFt,
    includeDimensions: cadIncludeDimensions,
    includeVastuGrid: cadIncludeVastuGrid,
    projectName: project?.title,
    clientName: project?.clientName
  }), [cadUnitSystem, cadWallHeightFt, cadIncludeDimensions, cadIncludeVastuGrid, project]);

  const handleExtractCad = (ext: CadFileExtension) => {
    try {
      downloadCadFile(ext, layoutOption, cadOptions);
      const extLabel = ext.toUpperCase();
      showNotification(`Architectural CAD Model (.${extLabel}) extracted successfully!`);
    } catch (err) {
      console.error(`CAD export failed for ${ext}:`, err);
      showNotification(`Failed to export CAD .${ext.toUpperCase()}`);
    }
  };

  const handleDownloadAllZip = async () => {
    try {
      setIsPackagingZip(true);
      const zipBlob = await generateCadZipBundle(layoutOption, cadOptions);
      const baseName = `VASTU-${plotWidth}x${plotDepth}-${layoutOption.totalBuiltUpSqFt}SQFT-${layoutOption.facingDirection}-OPT${layoutOption.optionNumber}`;
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}-CAD-EXTRACTION-PACK.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification(`Complete CAD Package (.ZIP with .DWG, .DXF, .STEP, .STL & Specs) downloaded!`);
    } catch (err) {
      console.error('ZIP generation failed:', err);
      showNotification('Failed to generate CAD ZIP package');
    } finally {
      setIsPackagingZip(false);
    }
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col">
      {/* Top Architectural Toolbar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 text-sky-400 flex items-center justify-center font-mono font-bold text-xs">
            CAD
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-semibold text-white tracking-wide">
                Architectural Floor Plan
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-slate-400 text-xs">
                Plot: {plotWidth}' × {plotDepth}' ({layoutOption.totalBuiltUpSqFt.toLocaleString()} sq.ft)
              </span>
              <span aria-hidden="true" className="text-slate-600">·</span>
              <span className="text-emerald-400 text-xs font-medium">
                {layoutOption.vastuScore}% Vastu Compliant
              </span>
            </div>
            <p className="text-[11px] text-slate-400 mt-0.5">
              {layoutOption.title} · {layoutOption.configuration} · Facing {layoutOption.facingDirection}
            </p>
          </div>
        </div>

        {/* Action and Display Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Segment */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => setActiveViewMode('cad_dynamic')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer flex items-center gap-1.5 ${
                activeViewMode === 'cad_dynamic'
                  ? 'bg-slate-800 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Box className="w-3 h-3 text-sky-400" />
              <span>CAD Blueprint</span>
            </button>
            <button
              onClick={() => setActiveViewMode('split')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                activeViewMode === 'split'
                  ? 'bg-slate-800 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Split View
            </button>
            <button
              onClick={() => setActiveViewMode('reference_render')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                activeViewMode === 'reference_render'
                  ? 'bg-slate-800 text-white shadow-xs font-semibold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Render
            </button>
          </div>

          {/* Theme Selector (Dark Blueprint / White Linen / Vastu Heatmap) */}
          <div className="flex items-center bg-slate-800/90 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setCadTheme('cad_blueprint')}
              className={`px-2 py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                cadTheme === 'cad_blueprint' ? 'bg-cyan-700 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Classic CAD Cyan Blueprint"
            >
              Dark CAD
            </button>
            <button
              onClick={() => setCadTheme('drafting_white')}
              className={`px-2 py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                cadTheme === 'drafting_white' ? 'bg-slate-200 text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Drafting White Paper / Linen"
            >
              White Vellum
            </button>
            <button
              onClick={() => setCadTheme('vastu_heatmap')}
              className={`px-2 py-1 rounded text-[10px] font-mono transition cursor-pointer ${
                cadTheme === 'vastu_heatmap' ? 'bg-amber-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
              title="Vastu Energy Heatmap"
            >
              Vastu Energy
            </button>
          </div>

          {/* Toggles */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 border cursor-pointer ${
              showDimensions
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Live Dimension Callout Lines"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Dims</span>
          </button>

          <button
            onClick={() => setShowVastuOverlay(!showVastuOverlay)}
            className={`px-2 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1 border cursor-pointer ${
              showVastuOverlay
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle 9-Zone Vastu Mandala Energy Layer"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Zones</span>
          </button>

          {/* Zoom Controls */}
          <div className="flex items-center bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
            <button
              onClick={handleZoomOut}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[10px] font-mono text-slate-300 select-none">
              {Math.round(zoomLevel * 100)}%
            </span>
            <button
              onClick={handleZoomIn}
              className="p-1.5 text-slate-300 hover:text-white hover:bg-slate-700 transition cursor-pointer"
              title="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 transition border-l border-slate-700 cursor-pointer"
              title="Reset Zoom"
            >
              <RotateCcw className="w-3 h-3" />
            </button>
          </div>

          {/* Lightbox / Fullscreen */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="p-1.5 bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg border border-slate-700 transition cursor-pointer"
            title="Open High-Res Fullscreen Lightbox"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* CAD Export & Extraction Workstation Toolbar */}
      <div className="bg-slate-950 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="font-medium text-slate-300">
            CAD Model Package Ready
          </span>
          <span aria-hidden="true" className="text-slate-600">·</span>
          <span className="text-slate-400 font-mono text-[11px]">
            {plotWidth}' × {plotDepth}' · {layoutOption.facingDirection} Facing
          </span>
          {downloadSuccessMessage && (
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[11px] flex items-center gap-1">
              <Check className="w-3 h-3 text-emerald-400" />
              <span>{downloadSuccessMessage}</span>
            </span>
          )}
        </div>

        {/* CAD Multi-Format Extraction Actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* Main CAD Multi-Format Extraction Studio Button */}
          <button
            onClick={() => setIsCadModalOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition flex items-center gap-2 shadow-xs cursor-pointer text-xs"
            title="Open CAD Extraction Dialog: Extract .DWG, .DXF, .STEP, .STL and ZIP Package"
          >
            <Box className="w-3.5 h-3.5" />
            <span>CAD Extraction Studio</span>
          </button>

          {/* Quick-Download Chips for all 4 CAD extensions */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800">
            <button
              onClick={() => handleExtractCad('dwg')}
              className="px-2.5 py-1 rounded text-[11px] font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Extract AutoCAD Drawing Database (.DWG) - AC1032 binary drawing"
            >
              .DWG
            </button>
            <button
              onClick={() => handleExtractCad('dxf')}
              className="px-2.5 py-1 rounded text-[11px] font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Extract AutoCAD Drawing Exchange Format (.DXF) - ASCII Layers"
            >
              .DXF
            </button>
            <button
              onClick={() => handleExtractCad('step')}
              className="px-2.5 py-1 rounded text-[11px] font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Extract 3D Solid Model (.STEP) - ISO 10303-21 B-Rep for SolidWorks/Revit/Fusion"
            >
              .STEP
            </button>
            <button
              onClick={() => handleExtractCad('stl')}
              className="px-2.5 py-1 rounded text-[11px] font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Extract 3D Stereolithography Mesh (.STL) - For 3D Printing & 3D CAD"
            >
              .STL
            </button>
            <button
              onClick={handleDownloadAllZip}
              disabled={isPackagingZip}
              className="px-2.5 py-1 rounded text-[11px] font-mono font-medium text-slate-300 hover:text-white hover:bg-slate-800 transition cursor-pointer flex items-center gap-1 border-l border-slate-800 ml-0.5 pl-2"
              title="Download Complete 4-Format CAD Package (.ZIP)"
            >
              <PackageCheck className="w-3 h-3 text-slate-400" />
              <span>{isPackagingZip ? '...' : '.ZIP'}</span>
            </button>
          </div>

          {/* 1. Download SVG */}
          <button
            onClick={handleDownloadSvg}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition flex items-center gap-1.5 border border-slate-700 cursor-pointer text-xs"
            title="Download Vector CAD Blueprint (.SVG) - Opens in AutoCAD, Illustrator, Browsers"
          >
            <Download className="w-3.5 h-3.5 text-blue-400" />
            <span>.SVG</span>
          </button>

          {/* 2. Download PNG */}
          <button
            onClick={handleDownloadPng}
            disabled={isExportingPng}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-700 font-medium transition flex items-center gap-1.5 cursor-pointer text-xs disabled:opacity-50"
            title="Download High-Resolution Blueprint Image (.PNG) for Printing / Client Presentation"
          >
            <FileImage className="w-3.5 h-3.5 text-cyan-400" />
            <span>{isExportingPng ? 'PNG...' : '.PNG'}</span>
          </button>

          {/* 3. Download JSON Schedule */}
          <button
            onClick={handleDownloadScheduleJson}
            className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-700 transition flex items-center gap-1 cursor-pointer text-xs"
            title="Download Complete Architectural Room Schedule & Vastu Specification (.JSON)"
          >
            <FileCode className="w-3.5 h-3.5 text-amber-400" />
            <span>.JSON</span>
          </button>
        </div>
      </div>

      {/* Main Floor Plan Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[540px]">
        {/* Architectural Drawing Workspace (Left/Center) */}
        <div className={`${activeViewMode === 'split' ? 'lg:col-span-8' : 'lg:col-span-12'} relative bg-slate-950 flex items-center justify-center p-3 sm:p-5 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800`}>
          {/* Subtle CAD Grid background */}
          <div 
            className="absolute inset-0 opacity-15 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, #38bdf8 1px, transparent 1px), linear-gradient(to bottom, #38bdf8 1px, transparent 1px)',
              backgroundSize: '32px 32px'
            }}
          />

          {/* North Direction Compass Badge */}
          <div className="absolute top-4 left-4 z-20 bg-slate-900/90 backdrop-blur-xs border border-slate-700 rounded-xl p-2.5 shadow-lg flex items-center gap-3">
            <div className="w-8 h-8 rounded-full border border-amber-400/50 flex items-center justify-center relative bg-slate-950">
              <span className="text-[10px] font-bold text-amber-400 absolute -top-1 font-mono">N</span>
              <Compass className="w-5 h-5 text-amber-400 animate-pulse" />
              <span className="text-[9px] font-bold text-slate-400 absolute -bottom-1 font-mono">S</span>
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Orientation</div>
              <div className="text-xs font-bold text-white flex items-center gap-1">
                <span>{layoutOption.facingDirection} Facing</span>
                <span className="text-[9px] text-emerald-400 font-mono font-normal">Surya Prana</span>
              </div>
            </div>
          </div>

          {/* Drawing Content */}
          <div 
            className="relative transition-transform duration-200 ease-out origin-center max-w-full flex items-center justify-center"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {activeViewMode === 'reference_render' ? (
              <div className="relative group rounded-lg overflow-hidden border border-slate-700/80 shadow-2xl bg-white max-w-[820px]">
                <img
                  src={getFloorPlanImage(layoutOption.optionNumber)}
                  alt={`Architectural Floor Plan Reference - ${layoutOption.title}`}
                  className="w-full max-h-[560px] object-contain select-none"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute bottom-2 left-2 right-2 bg-slate-950/80 backdrop-blur-xs p-2 rounded text-[11px] text-slate-300 text-center">
                  Static Reference Render shown. Switch to <span className="text-cyan-400 font-bold">Live CAD Blueprint</span> to view the dynamic scaled visualization for {plotWidth}' × {plotDepth}'.
                </div>
              </div>
            ) : (
              /* Live Dynamic Scaled Architectural SVG Blueprint */
              <div 
                className="w-full max-w-[940px] rounded-xl overflow-hidden shadow-2xl flex items-center justify-center border border-slate-800 [&>svg]:w-full [&>svg]:h-auto [&>svg]:block"
                dangerouslySetInnerHTML={{ __html: dynamicSvgMarkup }}
              />
            )}
          </div>
        </div>

        {/* Room Dimensional Schedule & Analysis Panel (Right side in Split View) */}
        {activeViewMode === 'split' && (
          <div className="lg:col-span-4 bg-slate-900 p-4 space-y-4 overflow-y-auto max-h-[600px] text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-blue-400" />
                <span>Live Dimensional Schedule</span>
              </span>
              <span className="text-[11px] font-mono text-cyan-400 bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800">
                {layoutOption.rooms.length} Spaces Calibrated
              </span>
            </div>

            {/* Room items list */}
            <div className="space-y-2">
              {layoutOption.rooms.map((room, idx) => (
                <div
                  key={idx}
                  onClick={() => setSelectedRoom(room)}
                  className={`p-2.5 rounded-lg border transition cursor-pointer ${
                    selectedRoom?.name === room.name
                      ? 'bg-blue-950/60 border-blue-500 text-white shadow-sm'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-white text-[11px]">{room.name}</span>
                    <span className="font-mono text-cyan-400 font-bold text-[11px] whitespace-nowrap">
                      {formatFtIn(room.lengthFt)} × {formatFtIn(room.widthFt)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>{room.carpetAreaSqFt} sq.ft ({Math.round((room.carpetAreaSqFt / layoutOption.totalCarpetSqFt) * 100)}%)</span>
                    <span className="text-amber-400 font-semibold">{room.vastuDirection}</span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-1 line-clamp-1">
                    {room.vastuSignificance}
                  </div>
                </div>
              ))}
            </div>

            {/* Architectural Summary Notes */}
            <div className="p-3 rounded-lg bg-slate-950 border border-slate-800 text-slate-400 text-[11px] space-y-1">
              <div className="text-white font-semibold flex items-center gap-1">
                <Info className="w-3.5 h-3.5 text-blue-400" />
                <span>Architectural Notes:</span>
              </div>
              <p>{layoutOption.architecturalNotes}</p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Footer Actions */}
      <div className="bg-slate-950 px-4 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-slate-400 text-[11px] flex-wrap">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
            Nairutya SW Master
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            Agni SE Kitchen
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
            Ishanya NE Mandir
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400 inline-block" />
            Open Brahmasthan
          </span>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Print/Download button */}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print Sheet</span>
          </button>

          {/* Fullscreen Lightbox trigger */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>Fullscreen View</span>
          </button>

          {/* Apply to project button */}
          {onApplyLayout && (
            <button
              onClick={() => onApplyLayout(layoutOption)}
              className={`px-4 py-1.5 rounded-lg font-bold transition flex items-center gap-1.5 cursor-pointer text-xs ${
                isApplied
                  ? 'bg-emerald-600 text-white'
                  : 'bg-blue-600 hover:bg-blue-500 text-white shadow-sm'
              }`}
            >
              {isApplied ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Applied to Job Card</span>
                </>
              ) : (
                <>
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Adopt This Plan</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>

      {/* High-Resolution Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex flex-col p-4 backdrop-blur-md">
          <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800 flex-wrap gap-2">
            <div>
              <h4 className="font-bold text-sm tracking-wide flex items-center gap-2">
                <span>{layoutOption.title} — High-Resolution Architectural CAD Blueprint</span>
                <span className="text-xs font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
                  {plotWidth}' × {plotDepth}' ({layoutOption.totalBuiltUpSqFt.toLocaleString()} sq.ft)
                </span>
              </h4>
              <p className="text-xs text-slate-400">
                {layoutOption.configuration} • Facing {layoutOption.facingDirection} • {layoutOption.vastuScore}% Vastu Purusha Compliance
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleDownloadSvg}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Fresh File (.SVG)</span>
              </button>
              <button
                onClick={handleDownloadPng}
                disabled={isExportingPng}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer"
              >
                <FileImage className="w-3.5 h-3.5 text-cyan-400" />
                <span>Export PNG</span>
              </button>
              <button
                onClick={() => setIsLightboxOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
                title="Exit Lightbox"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <div 
              className="max-h-[85vh] w-full max-w-[1200px] rounded-xl overflow-hidden shadow-2xl border border-slate-800 flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[82vh] [&>svg]:block"
              dangerouslySetInnerHTML={{ __html: dynamicSvgMarkup }}
            />
          </div>

          <div className="pt-2 text-center text-xs text-slate-400 font-mono">
            Full dynamic CAD vector graphics calibrated to 1/4" = 1'-0" architectural scale. Double-line walls, room schedule, and directional orientation reflect exact requested specifications.
          </div>
        </div>
      )}

      {/* CAD & 3D Engineering Model Extraction Hub Modal */}
      {isCadModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden text-slate-200">
            {/* Modal Header */}
            <div className="bg-slate-950 px-5 py-4 border-b border-slate-800 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white flex items-center justify-center shadow-lg font-bold">
                  <Cpu className="w-5 h-5 text-amber-300" />
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-bold text-white text-base">
                      CAD &amp; 3D Solid Model Extraction Studio
                    </h3>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-blue-900/60 text-cyan-300 border border-blue-700/50">
                      PLOT: {plotWidth}' × {plotDepth}' ({layoutOption.totalBuiltUpSqFt.toLocaleString()} SQ.FT)
                    </span>
                    <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                      {layoutOption.vastuScore}% VASTU
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Extract directly into industry-standard CAD extensions: <strong className="text-amber-300">.DWG</strong>, <strong className="text-cyan-300">.DXF</strong>, <strong className="text-emerald-300">.STEP</strong>, and <strong className="text-purple-300">.STL</strong>
                  </p>
                </div>
              </div>
              <button
                onClick={() => setIsCadModalOpen(false)}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition cursor-pointer"
                title="Close CAD Studio"
              >
                <Minimize2 className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-slate-950/60 px-5 pt-3 border-b border-slate-800 flex items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setCadActiveTab('formats')}
                  className={`px-3 py-2 font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                    cadActiveTab === 'formats'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <PackageCheck className="w-4 h-4" />
                  <span>CAD Extensions (.dwg, .dxf, .step, .stl)</span>
                </button>
                <button
                  onClick={() => setCadActiveTab('preview')}
                  className={`px-3 py-2 font-bold border-b-2 transition cursor-pointer flex items-center gap-1.5 ${
                    cadActiveTab === 'preview'
                      ? 'border-blue-500 text-blue-400'
                      : 'border-transparent text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <Code2 className="w-4 h-4" />
                  <span>Live Entity &amp; Code Inspector</span>
                </button>
              </div>

              {/* Extraction Parameters Quick Strip */}
              <div className="flex items-center gap-3 pb-2 text-[11px] text-slate-400">
                <div className="flex items-center gap-1.5">
                  <span>Units:</span>
                  <select
                    value={cadUnitSystem}
                    onChange={e => setCadUnitSystem(e.target.value as any)}
                    className="bg-slate-800 border border-slate-700 rounded px-2 py-0.5 text-slate-200 font-mono text-xs focus:ring-1 focus:ring-blue-500"
                  >
                    <option value="imperial_feet">Imperial (Feet &amp; Inches)</option>
                    <option value="metric_mm">Metric (Millimeters - mm)</option>
                  </select>
                </div>
                <div className="flex items-center gap-1.5">
                  <span>Wall H:</span>
                  <input
                    type="number"
                    min={8}
                    max={18}
                    step={0.5}
                    value={cadWallHeightFt}
                    onChange={e => setCadWallHeightFt(parseFloat(e.target.value) || 10)}
                    className="w-14 bg-slate-800 border border-slate-700 rounded px-1.5 py-0.5 text-center text-slate-200 font-mono text-xs"
                  />
                  <span>ft</span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-5 flex-1 overflow-y-auto space-y-5 text-xs">
              {cadActiveTab === 'formats' && (
                <>
                  {/* The 4 Core CAD Extensions Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* 1. .DWG */}
                    <div className="bg-slate-950/70 border border-amber-500/30 rounded-xl p-4 flex flex-col justify-between hover:border-amber-500/60 transition shadow-sm group">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-300 font-mono font-bold flex items-center justify-center text-xs">
                              .DWG
                            </span>
                            <div>
                              <h4 className="font-bold text-white text-sm">
                                AutoCAD Drawing Database (.DWG)
                              </h4>
                              <span className="text-[10px] font-mono text-amber-400">
                                Native Autodesk Format (AC1032)
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-amber-950 text-amber-300 border border-amber-700/50">
                            AutoCAD 2013-2026
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-2.5 leading-relaxed">
                          Standard native binary drawing file for AutoCAD. Preserves full architectural layers, wall thickness, door swings, window glass lines, room callouts, and dimension chains.
                        </p>
                        <div className="mt-3 bg-slate-900 rounded-lg p-2.5 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                          <div><strong>Compatible Software:</strong> Autodesk AutoCAD, DWG TrueView, CorelCAD, DraftSight, BricsCAD, AutoCAD Web &amp; Mobile</div>
                          <div><strong>Layers:</strong> A-WALL-EXTR, A-WALL-INTR, A-DOOR-SWNG, A-GLAZ-WNDW, A-ANNO-TEXT, A-ANNO-DIMS, A-VAST-GRID</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400">Extension: *.dwg</span>
                        <button
                          onClick={() => handleExtractCad('dwg')}
                          className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-950" />
                          <span>Extract .DWG</span>
                        </button>
                      </div>
                    </div>

                    {/* 2. .DXF */}
                    <div className="bg-slate-950/70 border border-cyan-500/30 rounded-xl p-4 flex flex-col justify-between hover:border-cyan-500/60 transition shadow-sm group">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-bold flex items-center justify-center text-xs">
                              .DXF
                            </span>
                            <div>
                              <h4 className="font-bold text-white text-sm">
                                Drawing Exchange Format (.DXF)
                              </h4>
                              <span className="text-[10px] font-mono text-cyan-400">
                                Open Autodesk Interchange (ASCII R2018)
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-cyan-950 text-cyan-300 border border-cyan-700/50">
                            Universal 2D CAD
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-2.5 leading-relaxed">
                          Open ASCII standard for cross-platform CAD interchange. Structured with TABLES, LAYERS, ENTITIES (LINE, LWPOLYLINE, ARC, TEXT, DIMENSION) and ACI standard color coding.
                        </p>
                        <div className="mt-3 bg-slate-900 rounded-lg p-2.5 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                          <div><strong>Compatible Software:</strong> AutoCAD, LibreCAD, Revit, SketchUp, Blender, Rhino, FreeCAD, Adobe Illustrator</div>
                          <div><strong>Color Coding:</strong> Red (Ext Walls), Yellow (Int Walls), Cyan (Doors), Blue (Windows), Green (Dims), White (Text)</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400">Extension: *.dxf</span>
                        <button
                          onClick={() => handleExtractCad('dxf')}
                          className="px-3.5 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-950" />
                          <span>Extract .DXF</span>
                        </button>
                      </div>
                    </div>

                    {/* 3. .STEP */}
                    <div className="bg-slate-950/70 border border-emerald-500/30 rounded-xl p-4 flex flex-col justify-between hover:border-emerald-500/60 transition shadow-sm group">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 font-mono font-bold flex items-center justify-center text-xs">
                              .STEP
                            </span>
                            <div>
                              <h4 className="font-bold text-white text-sm">
                                ISO 10303-21 3D Solid Model (.STEP / .STP)
                              </h4>
                              <span className="text-[10px] font-mono text-emerald-400">
                                3D Manifold Solid B-Rep Geometry
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-700/50">
                            3D Engineering &amp; BIM
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-2.5 leading-relaxed">
                          High-precision 3D boundary representation solid bodies (MANIFOLD_SOLID_BREP). Generates true 3D extruded architectural wall bodies, floor foundation slab, and internal room volumes.
                        </p>
                        <div className="mt-3 bg-slate-900 rounded-lg p-2.5 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                          <div><strong>Compatible Software:</strong> Dassault SolidWorks, Autodesk Fusion 360, Autodesk Revit, FreeCAD, CATIA, Rhino 3D, Siemens NX</div>
                          <div><strong>Solid Bodies:</strong> Foundation Slab Solid + 4 Perimeter Load-Bearing Wall Solids + Interior Partition Solids</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400">Extension: *.step / *.stp</span>
                        <button
                          onClick={() => handleExtractCad('step')}
                          className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-slate-950" />
                          <span>Extract .STEP</span>
                        </button>
                      </div>
                    </div>

                    {/* 4. .STL */}
                    <div className="bg-slate-950/70 border border-purple-500/30 rounded-xl p-4 flex flex-col justify-between hover:border-purple-500/60 transition shadow-sm group">
                      <div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="w-8 h-8 rounded-lg bg-purple-500/20 border border-purple-500/40 text-purple-300 font-mono font-bold flex items-center justify-center text-xs">
                              .STL
                            </span>
                            <div>
                              <h4 className="font-bold text-white text-sm">
                                3D Stereolithography Mesh (.STL)
                              </h4>
                              <span className="text-[10px] font-mono text-purple-400">
                                3D Printing &amp; Architectural Mesh
                              </span>
                            </div>
                          </div>
                          <span className="px-2 py-0.5 rounded text-[10px] bg-purple-950 text-purple-300 border border-purple-700/50">
                            3D Mesh &amp; Fabrication
                          </span>
                        </div>
                        <p className="text-slate-300 text-[11px] mt-2.5 leading-relaxed">
                          Triangular facet 3D mesh representation of the entire architectural floor plan. Extruded with foundation slab, double-line walls, and door openings. Ready for 3D scale model printing.
                        </p>
                        <div className="mt-3 bg-slate-900 rounded-lg p-2.5 border border-slate-800 text-[10px] text-slate-400 space-y-1">
                          <div><strong>Compatible Software:</strong> UltiMaker Cura, PrusaSlicer, Bambu Studio, AutoCAD 3D, Blender, 3ds Max, SketchUp, MeshLab</div>
                          <div><strong>Mesh Geometry:</strong> 12 Facets per solid box with outward unit surface normals and vertex coordinates</div>
                        </div>
                      </div>
                      <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-[11px] font-mono text-slate-400">Extension: *.stl</span>
                        <button
                          onClick={() => handleExtractCad('stl')}
                          className="px-3.5 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm text-xs"
                        >
                          <Download className="w-3.5 h-3.5 text-white" />
                          <span>Extract .STL</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* All-in-One CAD Multi-Format Bundle Banner */}
                  <div className="bg-gradient-to-r from-blue-900/60 via-indigo-900/60 to-purple-900/60 border border-indigo-500/50 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-md">
                        <PackageCheck className="w-6 h-6 text-amber-300" />
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-sm">
                          Download Complete 4-Format CAD Package (.ZIP)
                        </h4>
                        <p className="text-[11px] text-indigo-200 mt-0.5">
                          Bundles <strong>.DWG</strong> + <strong>.DXF</strong> + <strong>.STEP</strong> + <strong>.STL</strong> + <strong>README_CAD_INSTRUCTIONS.txt</strong> containing layer maps, scale factors &amp; dimensional schedules.
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={handleDownloadAllZip}
                      disabled={isPackagingZip}
                      className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold transition flex items-center gap-2 cursor-pointer shadow-md shrink-0 text-xs disabled:opacity-50"
                    >
                      <Download className="w-4 h-4 text-slate-950" />
                      <span>{isPackagingZip ? 'Packaging CAD ZIP...' : 'Extract All Formats (.ZIP)'}</span>
                    </button>
                  </div>
                </>
              )}

              {/* Tab 2: Raw Code & Entity Inspector */}
              {cadActiveTab === 'preview' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-300">Inspect Extracted CAD Entity Code:</span>
                      <div className="flex items-center bg-slate-800 rounded-lg p-0.5 border border-slate-700">
                        <button
                          onClick={() => setCadPreviewFormat('dxf')}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                            cadPreviewFormat === 'dxf' ? 'bg-cyan-700 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          .DXF (ASCII)
                        </button>
                        <button
                          onClick={() => setCadPreviewFormat('step')}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                            cadPreviewFormat === 'step' ? 'bg-emerald-700 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          .STEP (ISO-10303)
                        </button>
                        <button
                          onClick={() => setCadPreviewFormat('stl')}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                            cadPreviewFormat === 'stl' ? 'bg-purple-700 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          .STL (Facets)
                        </button>
                        <button
                          onClick={() => setCadPreviewFormat('dwg')}
                          className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold transition cursor-pointer ${
                            cadPreviewFormat === 'dwg' ? 'bg-amber-700 text-white' : 'text-slate-400 hover:text-white'
                          }`}
                        >
                          .DWG (Header)
                        </button>
                      </div>
                    </div>
                    <button
                      onClick={() => handleExtractCad(cadPreviewFormat === 'dwg' ? 'dwg' : cadPreviewFormat)}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition text-[11px] flex items-center gap-1 cursor-pointer"
                    >
                      <Download className="w-3 h-3" />
                      <span>Download .{cadPreviewFormat.toUpperCase()}</span>
                    </button>
                  </div>

                  {/* Code Block Container */}
                  <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-[11px] text-slate-300 max-h-[360px] overflow-auto select-all">
                    {cadPreviewFormat === 'dxf' && (
                      <pre className="whitespace-pre">{generateDxfContent(layoutOption, cadOptions).split('\n').slice(0, 160).join('\n') + '\n\n... [Remaining entities truncated for browser preview]'}</pre>
                    )}
                    {cadPreviewFormat === 'step' && (
                      <pre className="whitespace-pre">{generateStepContent(layoutOption, cadOptions).split('\n').slice(0, 160).join('\n') + '\n\n... [Remaining ISO solids truncated for browser preview]'}</pre>
                    )}
                    {cadPreviewFormat === 'stl' && (
                      <pre className="whitespace-pre">{generateStlContent(layoutOption, cadOptions).split('\n').slice(0, 160).join('\n') + '\n\n... [Remaining triangle mesh facets truncated for browser preview]'}</pre>
                    )}
                    {cadPreviewFormat === 'dwg' && (
                      <div className="space-y-2">
                        <div className="text-amber-300 font-bold">AutoCAD DWG Native Binary Container (AC1032)</div>
                        <div className="text-slate-400">Header Signature: 0x41 0x43 0x31 0x30 0x33 0x32 (AC1032)</div>
                        <div className="text-slate-400">Drawing Stream Size: ~{(generateDxfContent(layoutOption, cadOptions).length / 1024).toFixed(1)} KB</div>
                        <div className="text-slate-400">Binary Container: Ready for direct download &amp; opening in Autodesk AutoCAD 2013-2026, DWG TrueView, CorelCAD, DraftSight.</div>
                        <div className="mt-4 p-3 bg-slate-900 rounded border border-slate-800 text-cyan-300">
                          Click "Extract .DWG" to download the AutoCAD Drawing file directly.
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-950 px-5 py-3 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
              <span className="text-slate-400 font-mono text-[11px]">
                Engine: Build Storys CAD Multi-Format Vector &amp; Solid Kernel v2.4
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsCadModalOpen(false)}
                  className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition cursor-pointer"
                >
                  Close
                </button>
                <button
                  onClick={handleDownloadAllZip}
                  disabled={isPackagingZip}
                  className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold transition flex items-center gap-1.5 cursor-pointer shadow-sm disabled:opacity-50"
                >
                  <PackageCheck className="w-3.5 h-3.5 text-amber-300" />
                  <span>{isPackagingZip ? 'Packaging...' : 'Download CAD Bundle (.ZIP)'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
