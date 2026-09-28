import React, { useState, useRef } from 'react';
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
  EyeOff, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  ChevronRight,
  Info
} from 'lucide-react';
import { VastuLayoutOption, VastuRoomSuggestion, ProjectRecord } from '../types/erp';

// High-resolution architectural CAD plan assets generated for each layout option
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
  const [showTitleBlock, setShowTitleBlock] = useState<boolean>(true);
  const [activeViewMode, setActiveViewMode] = useState<'cad_render' | 'cad_vector' | 'split'>('cad_render');
  const [hoveredRoom, setHoveredRoom] = useState<VastuRoomSuggestion | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<VastuRoomSuggestion | null>(null);
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

  // Map option number to corresponding generated high-res architectural blueprint drawing
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

  const currentPlanImage = getFloorPlanImage(layoutOption.optionNumber);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  // Format feet and decimal into feet-inches
  const formatFtIn = (decimalFt: number) => {
    const feet = Math.floor(decimalFt);
    const inches = Math.round((decimalFt - feet) * 12);
    return `${feet}'-${inches}"`;
  };

  const plotWidth = layoutOption.plotDimensions?.widthFt || (layoutOption.totalBuiltUpSqFt === 1200 ? 30 : Math.round(Math.sqrt(layoutOption.totalBuiltUpSqFt * 0.75)));
  const plotDepth = layoutOption.plotDimensions?.depthFt || (layoutOption.totalBuiltUpSqFt === 1200 ? 40 : Math.round(layoutOption.totalBuiltUpSqFt / plotWidth));

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg flex flex-col">
      {/* Top Architectural Toolbar */}
      <div className="bg-slate-950 px-4 py-3 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-600/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-mono font-bold text-xs">
            ARC
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-white tracking-wide">
                Architectural Floor Plan Drawing
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-900/60 text-blue-300 border border-blue-700/50">
                PLOT: {plotWidth}' × {plotDepth}' ({layoutOption.totalBuiltUpSqFt.toLocaleString()} SQ.FT)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-900/60 text-emerald-300 border border-emerald-700/50">
                {layoutOption.vastuScore}% VASTU COMPLIANT
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              {layoutOption.title} • {layoutOption.totalBuiltUpSqFt.toLocaleString()} sq.ft Built-Up ({layoutOption.totalCarpetSqFt.toLocaleString()} sq.ft Carpet)
            </p>
          </div>
        </div>

        {/* Action and Display Controls */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* View Mode Segment */}
          <div className="flex items-center bg-slate-800/80 rounded-lg p-0.5 border border-slate-700">
            <button
              onClick={() => setActiveViewMode('cad_render')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                activeViewMode === 'cad_render'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              CAD Render
            </button>
            <button
              onClick={() => setActiveViewMode('cad_vector')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                activeViewMode === 'cad_vector'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Interactive Vector
            </button>
            <button
              onClick={() => setActiveViewMode('split')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-medium transition cursor-pointer ${
                activeViewMode === 'split'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              Split View
            </button>
          </div>

          {/* Dimension toggle */}
          <button
            onClick={() => setShowDimensions(!showDimensions)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 border cursor-pointer ${
              showDimensions
                ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Architectural Dimension Callouts"
          >
            <Ruler className="w-3.5 h-3.5" />
            <span>Dimensions</span>
          </button>

          {/* Vastu Overlay toggle */}
          <button
            onClick={() => setShowVastuOverlay(!showVastuOverlay)}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition flex items-center gap-1.5 border cursor-pointer ${
              showVastuOverlay
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Vastu Quadrant Energy Overlay"
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Vastu Zones</span>
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
            title="Open Fullscreen Lightbox"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Floor Plan Canvas Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[520px]">
        {/* Architectural Drawing Workspace (Left/Center) */}
        <div className={`${activeViewMode === 'split' ? 'lg:col-span-8' : 'lg:col-span-12'} relative bg-slate-950 flex items-center justify-center p-4 overflow-hidden border-b lg:border-b-0 lg:border-r border-slate-800`}>
          {/* Subtle CAD Grid pattern */}
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
            className="relative transition-transform duration-200 ease-out origin-center max-w-full"
            style={{ transform: `scale(${zoomLevel})` }}
          >
            {activeViewMode === 'cad_render' || activeViewMode === 'split' ? (
              <div className="relative group rounded-lg overflow-hidden border border-slate-700/80 shadow-2xl bg-white">
                <img
                  src={currentPlanImage}
                  alt={`Architectural Floor Plan Blueprint - ${layoutOption.title}`}
                  className="w-full max-w-[820px] max-h-[580px] object-contain select-none"
                  referrerPolicy="no-referrer"
                />

                {/* Dimension Overlay Callouts (Positioned dynamically over rooms) */}
                {showDimensions && (
                  <div className="absolute inset-0 pointer-events-none p-4">
                    {/* Top dimension string bar */}
                    <div className="absolute top-2 left-6 right-6 border-b border-blue-400/80 flex justify-between items-center px-2 py-0.5 text-[10px] font-mono text-blue-900 bg-white/80 backdrop-blur-xs rounded shadow-xs">
                      <span>◄ TOTAL PLOT WIDTH: {plotWidth}'-0" ►</span>
                      <span className="font-bold">SCHEMATIC CAD PLAN • {layoutOption.totalBuiltUpSqFt.toLocaleString()} SQ.FT</span>
                      <span>◄ TOTAL PLOT DEPTH: {plotDepth}'-0" ►</span>
                    </div>

                    {/* Room Dimension Badges floating over plan */}
                    <div className="absolute top-10 left-8 z-10 pointer-events-auto">
                      <div className="bg-slate-900/90 text-white px-2 py-1 rounded-md text-[10px] font-mono border border-slate-700 shadow-md">
                        <span className="text-amber-300 font-bold block">{layoutOption.rooms[0]?.name || 'Master Bedroom'}</span>
                        <span>{layoutOption.rooms[0]?.lengthFt} ft × {layoutOption.rooms[0]?.widthFt} ft ({layoutOption.rooms[0]?.carpetAreaSqFt} sqft)</span>
                      </div>
                    </div>

                    <div className="absolute top-10 right-8 z-10 pointer-events-auto">
                      <div className="bg-slate-900/90 text-white px-2 py-1 rounded-md text-[10px] font-mono border border-slate-700 shadow-md">
                        <span className="text-cyan-300 font-bold block">{layoutOption.rooms[3]?.name || 'Pooja Mandir'}</span>
                        <span>{layoutOption.rooms[3]?.lengthFt} ft × {layoutOption.rooms[3]?.widthFt} ft ({layoutOption.rooms[3]?.carpetAreaSqFt} sqft)</span>
                      </div>
                    </div>

                    <div className="absolute bottom-14 right-8 z-10 pointer-events-auto">
                      <div className="bg-slate-900/90 text-white px-2 py-1 rounded-md text-[10px] font-mono border border-slate-700 shadow-md">
                        <span className="text-orange-300 font-bold block">{layoutOption.rooms[2]?.name || 'Modular Kitchen'}</span>
                        <span>{layoutOption.rooms[2]?.lengthFt} ft × {layoutOption.rooms[2]?.widthFt} ft ({layoutOption.rooms[2]?.carpetAreaSqFt} sqft)</span>
                      </div>
                    </div>

                    <div className="absolute bottom-14 left-8 z-10 pointer-events-auto">
                      <div className="bg-slate-900/90 text-white px-2 py-1 rounded-md text-[10px] font-mono border border-slate-700 shadow-md">
                        <span className="text-emerald-300 font-bold block">{layoutOption.rooms[1]?.name || 'Living Lounge'}</span>
                        <span>{layoutOption.rooms[1]?.lengthFt} ft × {layoutOption.rooms[1]?.widthFt} ft ({layoutOption.rooms[1]?.carpetAreaSqFt} sqft)</span>
                      </div>
                    </div>

                    {/* Central Brahmasthan Marker */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-auto text-center">
                      <div className="bg-purple-950/85 text-purple-200 border border-purple-500/70 px-2.5 py-1 rounded-full text-[10px] font-mono shadow-lg flex items-center gap-1.5">
                        <Sparkles className="w-3 h-3 text-amber-300" />
                        <span>BRAHMASTHAN (OPEN {layoutOption.optionNumber === 2 ? 'SKYLIT COURTYARD' : 'CORE'})</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Interactive Vector Blueprint (SVG) */
              <div className="w-[740px] h-[520px] bg-slate-900 border-2 border-slate-600 rounded-lg relative p-4 select-none shadow-2xl overflow-hidden font-mono">
                {/* SVG CAD Architectural Diagram */}
                <svg viewBox="0 0 740 520" className="w-full h-full">
                  {/* Grid Lines */}
                  <defs>
                    <pattern id="cadGrid" width="20" height="20" patternUnits="userSpaceOnUse">
                      <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#334155" strokeWidth="0.5" strokeOpacity="0.5" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#cadGrid)" />

                  {/* Outer Wall Boundary with Hatching */}
                  <rect x="40" y="40" width="660" height="440" fill="none" stroke="#60a5fa" strokeWidth="4" />
                  <rect x="44" y="44" width="652" height="432" fill="none" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />

                  {/* OPTION 1: Classical Vastu Purusha Sanatana */}
                  {layoutOption.optionNumber === 1 && (
                    <>
                      {/* Master Suite (South-West / Nairutya) */}
                      <g 
                        className="cursor-pointer transition-all hover:opacity-90"
                        onMouseEnter={() => setHoveredRoom(layoutOption.rooms[0])}
                        onClick={() => setSelectedRoom(layoutOption.rooms[0])}
                      >
                        <rect x="48" y="270" width="250" height="200" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                        <text x="60" y="296" fill="#f8fafc" fontSize="11" fontWeight="bold">PRIMARY MASTER SUITE</text>
                        <text x="60" y="314" fill="#38bdf8" fontSize="10">{layoutOption.rooms[0]?.lengthFt}' × {layoutOption.rooms[0]?.widthFt}' ({layoutOption.rooms[0]?.carpetAreaSqFt} sq.ft)</text>
                        <text x="60" y="330" fill="#94a3b8" fontSize="9">SW (Nairutya • Earth Element)</text>
                        {/* Bed graphic */}
                        <rect x="70" y="345" width="70" height="85" fill="#334155" stroke="#475569" />
                        <rect x="75" y="350" width="28" height="20" fill="#64748b" />
                        <rect x="107" y="350" width="28" height="20" fill="#64748b" />
                        {/* Attached Bath on West */}
                        <rect x="180" y="360" width="110" height="100" fill="#0f172a" stroke="#64748b" strokeDasharray="2 2" />
                        <text x="188" y="380" fill="#94a3b8" fontSize="9">EN-SUITE BATH</text>
                        {/* Door swing arc */}
                        <path d="M 298 350 A 35 35 0 0 1 263 385" fill="none" stroke="#60a5fa" strokeWidth="1.5" strokeDasharray="2 2" />
                      </g>

                      {/* Living & Dining (North & East) */}
                      <g 
                        className="cursor-pointer transition-all hover:opacity-90"
                        onMouseEnter={() => setHoveredRoom(layoutOption.rooms[1])}
                        onClick={() => setSelectedRoom(layoutOption.rooms[1])}
                      >
                        <rect x="48" y="48" width="350" height="210" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                        <text x="60" y="74" fill="#f8fafc" fontSize="12" fontWeight="bold">FORMAL LIVING &amp; LOUNGE</text>
                        <text x="60" y="92" fill="#38bdf8" fontSize="10">{layoutOption.rooms[1]?.lengthFt}' × {layoutOption.rooms[1]?.widthFt}' ({layoutOption.rooms[1]?.carpetAreaSqFt} sq.ft)</text>
                        <text x="60" y="108" fill="#94a3b8" fontSize="9">North &amp; East (Surya Solar Prana)</text>
                        {/* Main entrance door */}
                        <line x1="170" y1="48" x2="230" y2="48" stroke="#f59e0b" strokeWidth="4" />
                        <text x="175" y="40" fill="#f59e0b" fontSize="9" fontWeight="bold">MAIN ENTRANCE</text>
                        {/* L-Sofa */}
                        <path d="M 65 130 L 65 210 L 150 210 L 150 185 L 90 185 L 90 130 Z" fill="#334155" stroke="#475569" />
                      </g>

                      {/* Modular Kitchen (South-East / Agni) */}
                      <g 
                        className="cursor-pointer transition-all hover:opacity-90"
                        onMouseEnter={() => setHoveredRoom(layoutOption.rooms[2])}
                        onClick={() => setSelectedRoom(layoutOption.rooms[2])}
                      >
                        <rect x="440" y="270" width="254" height="200" fill="#1e1e24" stroke="#f97316" strokeWidth="2" />
                        <text x="455" y="296" fill="#f8fafc" fontSize="11" fontWeight="bold">MODULAR KITCHEN &amp; UTILITY</text>
                        <text x="455" y="314" fill="#f97316" fontSize="10">{layoutOption.rooms[2]?.lengthFt}' × {layoutOption.rooms[2]?.widthFt}' ({layoutOption.rooms[2]?.carpetAreaSqFt} sq.ft)</text>
                        <text x="455" y="330" fill="#fdba74" fontSize="9">SE (Agni • Fire Element • Cook Faces East)</text>
                        {/* Countertop */}
                        <rect x="455" y="380" width="130" height="20" fill="#334155" />
                        <rect x="565" y="340" width="20" height="60" fill="#334155" />
                        {/* Cooktop symbol facing East */}
                        <circle cx="485" cy="390" r="6" fill="#ea580c" />
                        <circle cx="515" cy="390" r="6" fill="#ea580c" />
                      </g>

                      {/* Pooja Mandir (North-East / Ishanya) */}
                      <g 
                        className="cursor-pointer transition-all hover:opacity-90"
                        onMouseEnter={() => setHoveredRoom(layoutOption.rooms[3])}
                        onClick={() => setSelectedRoom(layoutOption.rooms[3])}
                      >
                        <rect x="550" y="48" width="144" height="130" fill="#172554" stroke="#06b6d4" strokeWidth="2" />
                        <text x="560" y="74" fill="#e0f2fe" fontSize="11" fontWeight="bold">POOJA SANCTUM</text>
                        <text x="560" y="92" fill="#38bdf8" fontSize="10">{layoutOption.rooms[3]?.lengthFt}' × {layoutOption.rooms[3]?.widthFt}'</text>
                        <text x="560" y="108" fill="#bae6fd" fontSize="9">NE (Ishanya Supreme)</text>
                        <circle cx="620" cy="135" r="16" fill="#0284c7" fillOpacity="0.4" stroke="#38bdf8" />
                        <text x="614" y="140" fill="#38bdf8" fontSize="12">🕉️</text>
                      </g>

                      {/* Guest Bedroom (North-West / Vayu) */}
                      <g 
                        className="cursor-pointer transition-all hover:opacity-90"
                        onMouseEnter={() => setHoveredRoom(layoutOption.rooms[4])}
                        onClick={() => setSelectedRoom(layoutOption.rooms[4])}
                      >
                        <rect x="408" y="48" width="134" height="130" fill="#1e293b" stroke="#38bdf8" strokeWidth="1.5" />
                        <text x="418" y="74" fill="#f8fafc" fontSize="10" fontWeight="bold">GUEST / CHILDREN</text>
                        <text x="418" y="92" fill="#94a3b8" fontSize="9">{layoutOption.rooms[4]?.lengthFt}' × {layoutOption.rooms[4]?.widthFt}'</text>
                        <text x="418" y="108" fill="#64748b" fontSize="8">{layoutOption.rooms[4]?.carpetAreaSqFt} SQ.FT • NW (Vayu)</text>
                      </g>

                      {/* Central Brahmasthan Dining */}
                      <rect x="306" y="210" width="126" height="145" fill="#3b0764" fillOpacity="0.25" stroke="#a855f7" strokeWidth="1.5" strokeDasharray="4 4" />
                      <text x="318" y="260" fill="#d8b4fe" fontSize="10" fontWeight="bold">BRAHMASTHAN</text>
                      <text x="322" y="278" fill="#c084fc" fontSize="9">DINING CORE</text>
                      {/* Dining Table representation */}
                      <rect x="328" y="290" width="60" height="35" rx="3" fill="#4c1d95" stroke="#a855f7" />
                    </>
                  )}

                  {/* OPTION 2: Contemporary Biophilic Open-Plan */}
                  {layoutOption.optionNumber === 2 && (
                    <>
                      {/* Central Skylit Green Courtyard Atrium */}
                      <rect x="270" y="170" width="190" height="170" fill="#064e3b" fillOpacity="0.35" stroke="#10b981" strokeWidth="2" strokeDasharray="3 3" />
                      <text x="290" y="235" fill="#6ee7b7" fontSize="11" fontWeight="bold">🌿 SKYLIT LIGHTWELL</text>
                      <text x="305" y="255" fill="#a7f3d0" fontSize="9">CENTRAL BRAHMASTHAN</text>
                      <text x="312" y="272" fill="#34d399" fontSize="8">Open to Sky Daylight Atrium</text>

                      {/* Open-Plan Great Living Room */}
                      <rect x="48" y="48" width="412" height="115" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                      <text x="60" y="74" fill="#f8fafc" fontSize="12" fontWeight="bold">OPEN-PLAN GREAT LIVING &amp; DINING</text>
                      <text x="60" y="92" fill="#38bdf8" fontSize="10">Wraps around central green courtyard with floor-to-ceiling glass</text>
                      <line x1="160" y1="48" x2="230" y2="48" stroke="#10b981" strokeWidth="4" />
                      <text x="170" y="40" fill="#10b981" fontSize="9" fontWeight="bold">PIVOT ENTRANCE</text>

                      {/* Island Kitchen (SE) */}
                      <rect x="470" y="270" width="224" height="200" fill="#1e1e24" stroke="#f97316" strokeWidth="2" />
                      <text x="485" y="296" fill="#f8fafc" fontSize="11" fontWeight="bold">CONTEMPORARY ISLAND KITCHEN</text>
                      <text x="485" y="314" fill="#f97316" fontSize="10">SE Agni • Breakfast Bar Island</text>
                      <rect x="520" y="340" width="90" height="40" rx="3" fill="#334155" stroke="#f97316" />
                      <text x="532" y="364" fill="#fdba74" fontSize="9">ISLAND HOB</text>

                      {/* Executive Home Office / Study (NW) */}
                      <rect x="470" y="48" width="224" height="210" fill="#1e293b" stroke="#818cf8" strokeWidth="2" />
                      <text x="485" y="74" fill="#e0e7ff" fontSize="11" fontWeight="bold">EXECUTIVE WORK-FROM-HOME</text>
                      <text x="485" y="92" fill="#a5b4fc" fontSize="10">NW Vayu • Acoustic Study Suite</text>
                      {/* Desk */}
                      <rect x="500" y="110" width="80" height="35" fill="#312e81" stroke="#818cf8" />
                      <text x="515" y="132" fill="#e0e7ff" fontSize="8">WORK DESK</text>

                      {/* Master Suite (SW) */}
                      <rect x="48" y="270" width="214" height="200" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                      <text x="60" y="296" fill="#f8fafc" fontSize="11" fontWeight="bold">MASTER BEDROOM SUITE</text>
                      <text x="60" y="314" fill="#38bdf8" fontSize="10">SW Nairutya • Acoustic Vestibule</text>
                    </>
                  )}

                  {/* OPTION 3: Smart Duplex / Multi-Generational */}
                  {layoutOption.optionNumber === 3 && (
                    <>
                      {/* Ground Floor Senior Suite (SW) */}
                      <rect x="48" y="270" width="250" height="200" fill="#1e293b" stroke="#38bdf8" strokeWidth="2" />
                      <text x="60" y="296" fill="#f8fafc" fontSize="11" fontWeight="bold">GROUND-FLOOR SENIOR SUITE</text>
                      <text x="60" y="314" fill="#38bdf8" fontSize="10">Step-free threshold • Senior Friendly Bath</text>
                      <text x="60" y="330" fill="#94a3b8" fontSize="9">SW Stability • Bed Headboard to South</text>

                      {/* Grand Living Salon (East & North) */}
                      <rect x="48" y="48" width="340" height="210" fill="#0f172a" stroke="#38bdf8" strokeWidth="2" />
                      <text x="60" y="74" fill="#f8fafc" fontSize="12" fontWeight="bold">DOUBLE-HEIGHT GRAND SALON</text>
                      <text x="60" y="92" fill="#38bdf8" fontSize="10">East Morning Sun • Garden Overlook</text>
                      <line x1="170" y1="48" x2="240" y2="48" stroke="#f59e0b" strokeWidth="4" />
                      <text x="180" y="40" fill="#f59e0b" fontSize="9" fontWeight="bold">PORTICO ENTRY</text>

                      {/* Chef Kitchen + Butler Pantry (SE) */}
                      <rect x="440" y="270" width="254" height="200" fill="#1e1e24" stroke="#f97316" strokeWidth="2" />
                      <text x="455" y="296" fill="#f8fafc" fontSize="11" fontWeight="bold">CHEF KITCHEN + BUTLER PANTRY</text>
                      <text x="455" y="314" fill="#f97316" fontSize="10">SE Agni • Dual Wet/Dry Workflow</text>

                      {/* Staircase Core (South) */}
                      <rect x="306" y="270" width="126" height="200" fill="#1e1b4b" stroke="#6366f1" strokeWidth="1.5" />
                      <text x="320" y="350" fill="#a5b4fc" fontSize="10" fontWeight="bold">STAIRCORE</text>
                      <text x="318" y="368" fill="#818cf8" fontSize="8">Clockwise Ascent</text>

                      {/* Pooja Meditation (NE) */}
                      <rect x="540" y="48" width="154" height="130" fill="#172554" stroke="#06b6d4" strokeWidth="2" />
                      <text x="550" y="74" fill="#e0f2fe" fontSize="11" fontWeight="bold">MEDITATION MANDIR</text>
                      <text x="550" y="92" fill="#38bdf8" fontSize="10">NE Ishanya Sanctuary</text>
                    </>
                  )}

                  {/* Dimension Strings (Outer Ticks) */}
                  <g stroke="#64748b" strokeWidth="1">
                    {/* Top dimension line */}
                    <line x1="40" y1="20" x2="700" y2="20" />
                    <line x1="40" y1="15" x2="40" y2="25" />
                    <line x1="700" y1="15" x2="700" y2="25" />
                    <text x="370" y="15" fill="#94a3b8" fontSize="10" textAnchor="middle">◄ {plotWidth}'-0" TOTAL PLOT WIDTH ►</text>

                    {/* Left dimension line */}
                    <line x1="20" y1="40" x2="20" y2="480" />
                    <line x1="15" y1="40" x2="25" y2="40" />
                    <line x1="15" y1="480" x2="25" y2="480" />
                    <text x="15" y="260" fill="#94a3b8" fontSize="10" textAnchor="middle" transform="rotate(-90 15,260)">◄ {plotDepth}'-0" TOTAL PLOT DEPTH ►</text>
                  </g>
                </svg>

                {/* Hover room tooltip */}
                {hoveredRoom && (
                  <div className="absolute bottom-4 left-4 bg-slate-950/95 border border-blue-500/50 p-2.5 rounded-lg shadow-xl text-white text-xs max-w-xs pointer-events-none">
                    <div className="font-bold text-blue-400">{hoveredRoom.name}</div>
                    <div className="text-[11px] text-slate-300">
                      Dimensions: <span className="font-mono text-amber-300">{hoveredRoom.lengthFt}' × {hoveredRoom.widthFt}' × {hoveredRoom.heightFt}'</span> ({hoveredRoom.carpetAreaSqFt} sq.ft)
                    </div>
                    <div className="text-[10px] text-slate-400 mt-1">
                      Zone: {hoveredRoom.vastuDirection} • Element: {hoveredRoom.vastuElement}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Architectural Drawing Title Block (Bottom-Right) */}
          {showTitleBlock && (
            <div className="absolute bottom-4 right-4 z-20 bg-slate-950/95 backdrop-blur-md border border-slate-700/80 rounded-xl p-3 shadow-2xl max-w-xs text-slate-300 font-mono text-[10px]">
              <div className="border-b border-slate-800 pb-1.5 mb-1.5 flex items-center justify-between">
                <span className="font-bold text-white text-xs tracking-wider">BUILD STORYS ARCHITECTURE</span>
                <span className="text-amber-400 font-bold">REV-01</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[10px]">
                <div>
                  <span className="text-slate-500 block">PLOT SIZE:</span>
                  <span className="text-slate-200 font-sans font-semibold truncate block">
                    {plotWidth}' × {plotDepth}' ({layoutOption.totalBuiltUpSqFt.toLocaleString()} sq.ft)
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 block">SHEET NO:</span>
                  <span className="text-slate-200 font-bold">ARC-VASTU-0{layoutOption.optionNumber}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">PLOT FACING:</span>
                  <span className="text-amber-300 font-bold">{layoutOption.facingDirection}</span>
                </div>
                <div>
                  <span className="text-slate-500 block">VASTU SCORE:</span>
                  <span className="text-emerald-400 font-bold">★ {layoutOption.vastuScore}/100</span>
                </div>
              </div>
              <div className="border-t border-slate-800 mt-1.5 pt-1 text-[9px] text-slate-400 flex items-center justify-between">
                <span>CAD TECHNICAL DRAFTING</span>
                <span className="text-blue-400">SCALE: 1/4" = 1'-0"</span>
              </div>
            </div>
          )}
        </div>

        {/* Room Dimensional Schedule & Analysis Panel (Right side in Split View) */}
        {activeViewMode === 'split' && (
          <div className="lg:col-span-4 bg-slate-900 p-4 space-y-4 overflow-y-auto max-h-[580px] text-xs">
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Ruler className="w-4 h-4 text-blue-400" />
                <span>Dimensional Schedule</span>
              </span>
              <span className="text-[11px] font-mono text-slate-400">
                {layoutOption.rooms.length} Spaces
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
                      ? 'bg-blue-950/60 border-blue-500 text-white'
                      : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-start justify-between gap-1">
                    <span className="font-semibold text-white text-[11px]">{room.name}</span>
                    <span className="font-mono text-blue-400 font-bold text-[11px] whitespace-nowrap">
                      {room.lengthFt}' × {room.widthFt}'
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 font-mono">
                    <span>{room.carpetAreaSqFt} sq.ft ({Math.round((room.carpetAreaSqFt / layoutOption.totalCarpetSqFt) * 100)}%)</span>
                    <span className="text-amber-400">{room.vastuDirection}</span>
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
        <div className="flex items-center gap-2 text-slate-400 text-[11px]">
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

        <div className="flex items-center gap-2">
          {/* Print/Download button */}
          <button
            onClick={() => window.print()}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Printer className="w-3.5 h-3.5 text-slate-400" />
            <span>Print CAD Sheet</span>
          </button>

          {/* Fullscreen Lightbox trigger */}
          <button
            onClick={() => setIsLightboxOpen(true)}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-medium transition flex items-center gap-1.5 cursor-pointer text-xs"
          >
            <Eye className="w-3.5 h-3.5 text-blue-400" />
            <span>High-Res Lightbox</span>
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
          <div className="flex items-center justify-between text-white pb-3 border-b border-slate-800">
            <div>
              <h4 className="font-bold text-sm tracking-wide">
                {layoutOption.title} — High-Resolution Architectural Blueprint
              </h4>
              <p className="text-xs text-slate-400">
                {layoutOption.configuration} • {layoutOption.totalBuiltUpSqFt} sq.ft • {layoutOption.vastuScore}% Vastu Purusha Compliance
              </p>
            </div>
            <button
              onClick={() => setIsLightboxOpen(false)}
              className="p-2 text-slate-400 hover:text-white rounded-lg bg-slate-800 hover:bg-slate-700 transition cursor-pointer"
            >
              <Minimize2 className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 flex items-center justify-center p-4 overflow-auto">
            <img
              src={currentPlanImage}
              alt="High Resolution Floor Plan"
              className="max-h-[85vh] max-w-full object-contain rounded-lg border border-slate-800 shadow-2xl bg-white"
              referrerPolicy="no-referrer"
            />
          </div>

          <div className="pt-2 text-center text-xs text-slate-400 font-mono">
            Dimension annotations, wall thicknesses, door swings, and orientation compass calibrated for 1/4" = 1'-0" architectural scale.
          </div>
        </div>
      )}
    </div>
  );
};
