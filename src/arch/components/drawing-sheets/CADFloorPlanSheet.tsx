import React, { useState } from 'react';
import {
  Ruler,
  Layers,
  Download,
  Upload,
  Maximize2,
  Check,
  Compass,
  FileCode,
  Eye,
  Info,
} from 'lucide-react';
import { ConceptOption, ArchitecturalVisualAsset } from '../../types';

interface CADFloorPlanSheetProps {
  concept: ConceptOption;
  asset?: ArchitecturalVisualAsset;
  clientName: string;
  builtUpAreaSqFt: number;
  siteAreaSqFt?: number;
  roomZones?: string[];
  onUploadCAD?: (fileDataUrl: string, fileName: string) => void;
  onOpenLightbox?: () => void;
}

export const CADFloorPlanSheet: React.FC<CADFloorPlanSheetProps> = ({
  concept,
  asset,
  clientName,
  builtUpAreaSqFt,
  siteAreaSqFt = builtUpAreaSqFt * 1.3,
  roomZones = [],
  onUploadCAD,
  onOpenLightbox,
}) => {
  const [cadViewMode, setCadViewMode] = useState<'vector_sheet' | 'render_image'>('vector_sheet');
  const [cadTheme, setCadTheme] = useState<'white_gfc' | 'autocad_dark' | 'blueprint'>('white_gfc');
  const [selectedRoom, setSelectedRoom] = useState<string | null>(null);

  const drawingNumber = asset?.drawingNumber || `DWG-A-10${concept.optionNumber}`;
  const scale = asset?.scale || '1:100 @ A3';
  const revision = asset?.revision || 'Rev B';
  const sheetDate = new Date().toISOString().split('T')[0];

  // Default zones if not provided from project
  const displayZones = roomZones.length > 0
    ? roomZones
    : [
        'Grand Foyer & Reception',
        'Open Living & Formal Dining',
        'Show Kitchen & Wet Scullery',
        'Master Sanctuary Suite',
        'Executive Library / Study',
        'Guest Suite & Powder Room',
      ];

  // Calculate zone allocations proportionally
  const zoneAllocations = displayZones.map((zoneName, idx) => {
    let weight = 1;
    if (zoneName.toLowerCase().includes('living') || zoneName.toLowerCase().includes('dining')) weight = 3.2;
    else if (zoneName.toLowerCase().includes('master')) weight = 2.4;
    else if (zoneName.toLowerCase().includes('kitchen')) weight = 1.6;
    else if (zoneName.toLowerCase().includes('library') || zoneName.toLowerCase().includes('study')) weight = 1.3;
    else if (zoneName.toLowerCase().includes('guest')) weight = 1.5;
    else weight = 1;

    const totalWeight = displayZones.reduce((sum, z) => {
      if (z.toLowerCase().includes('living') || z.toLowerCase().includes('dining')) return sum + 3.2;
      if (z.toLowerCase().includes('master')) return sum + 2.4;
      if (z.toLowerCase().includes('kitchen')) return sum + 1.6;
      if (z.toLowerCase().includes('library') || z.toLowerCase().includes('study')) return sum + 1.3;
      if (z.toLowerCase().includes('guest')) return sum + 1.5;
      return sum + 1;
    }, 0);

    const sqFt = Math.round((weight / totalWeight) * builtUpAreaSqFt);
    return {
      name: zoneName,
      sqFt,
      finishCode: `FL-0${(idx % 4) + 1}`,
      level: '+0.00m FFL',
    };
  });

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadCAD) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUploadCAD(event.target.result as string, file.name);
          setCadViewMode('render_image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById('cad-vector-sheet');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${drawingNumber}_CAD_Floor_Plan_${clientName.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Styling rules for the CAD Sheet based on selected theme
  const getThemeStyles = () => {
    switch (cadTheme) {
      case 'autocad_dark':
        return {
          sheetBg: 'bg-[#0f141c]',
          svgBg: '#0f141c',
          gridLine: '#263345',
          gridText: '#38bdf8',
          wallFill: '#1e293b',
          wallStroke: '#f8fafc',
          doorStroke: '#f43f5e',
          windowStroke: '#06b6d4',
          dimensionLine: '#10b981',
          dimensionText: '#10b981',
          roomText: '#f8fafc',
          roomSubtext: '#94a3b8',
          titleBlockBg: '#1e293b',
          titleBlockText: '#f8fafc',
          borderCol: 'border-slate-800',
        };
      case 'blueprint':
        return {
          sheetBg: 'bg-[#003366]',
          svgBg: '#003366',
          gridLine: '#0c4a8a',
          gridText: '#bfdbfe',
          wallFill: '#002244',
          wallStroke: '#ffffff',
          doorStroke: '#93c5fd',
          windowStroke: '#67e8f9',
          dimensionLine: '#60a5fa',
          dimensionText: '#93c5fd',
          roomText: '#ffffff',
          roomSubtext: '#bfdbfe',
          titleBlockBg: '#00254d',
          titleBlockText: '#ffffff',
          borderCol: 'border-blue-900',
        };
      case 'white_gfc':
      default:
        return {
          sheetBg: 'bg-white',
          svgBg: '#ffffff',
          gridLine: '#e2e8f0',
          gridText: '#64748b',
          wallFill: '#334155',
          wallStroke: '#0f172a',
          doorStroke: '#b91c1c',
          windowStroke: '#0284c7',
          dimensionLine: '#475569',
          dimensionText: '#334155',
          roomText: '#0f172a',
          roomSubtext: '#64748b',
          titleBlockBg: '#f8fafc',
          titleBlockText: '#0f172a',
          borderCol: 'border-slate-300',
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="space-y-3">
      {/* CAD Toolbar & Sheet Mode Selectors */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 text-white border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-slate-800 text-[11px]">
            {drawingNumber}
          </span>
          <span className="font-semibold text-slate-200">
            Architectural GFC Floor Plan Drawing
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Scale {scale}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switch: Vector CAD vs Render Image */}
          <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => setCadViewMode('vector_sheet')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                cadViewMode === 'vector_sheet'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>Vector CAD Sheet</span>
            </button>
            <button
              type="button"
              onClick={() => setCadViewMode('render_image')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                cadViewMode === 'render_image'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>CAD Raster Plan</span>
            </button>
          </div>

          {/* Theme Switcher for Vector Sheet */}
          {cadViewMode === 'vector_sheet' && (
            <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setCadTheme('white_gfc')}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                  cadTheme === 'white_gfc' ? 'bg-white text-slate-900 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="GFC White Paper Plot"
              >
                GFC Plot
              </button>
              <button
                type="button"
                onClick={() => setCadTheme('autocad_dark')}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                  cadTheme === 'autocad_dark' ? 'bg-slate-950 text-cyan-400 font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="AutoCAD Model Dark"
              >
                AutoCAD Dark
              </button>
              <button
                type="button"
                onClick={() => setCadTheme('blueprint')}
                className={`px-2 py-1 rounded text-[10px] font-semibold transition-colors ${
                  cadTheme === 'blueprint' ? 'bg-blue-700 text-white font-bold' : 'text-slate-400 hover:text-white'
                }`}
                title="Cyan Blueprint"
              >
                Blueprint
              </button>
            </div>
          )}

          {/* Actions: Export SVG & Upload CAD file */}
          {cadViewMode === 'vector_sheet' ? (
            <button
              type="button"
              onClick={handleDownloadSVG}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              title="Download Architectural CAD Drawing Sheet (SVG)"
            >
              <Download className="w-3 h-3 text-emerald-400" />
              <span>Export SVG</span>
            </button>
          ) : (
            onOpenLightbox && (
              <button
                type="button"
                onClick={onOpenLightbox}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Maximize2 className="w-3 h-3 text-amber-400" />
                <span>Fullscreen</span>
              </button>
            )
          )}

          <label className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white cursor-pointer transition-colors font-semibold">
            <Upload className="w-3 h-3" />
            <span>Upload Plan File</span>
            <input
              type="file"
              accept="image/*,.dwg,.dxf,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Main Drawing Canvas */}
      {cadViewMode === 'vector_sheet' ? (
        <div className={`rounded-2xl border ${themeStyles.borderCol} p-3 md:p-5 overflow-x-auto shadow-sm ${themeStyles.sheetBg} transition-colors duration-300`}>
          <svg
            id="cad-vector-sheet"
            viewBox="0 0 1100 700"
            className="w-full h-auto min-w-[700px] select-none font-sans"
            style={{ backgroundColor: themeStyles.svgBg }}
          >
            {/* Architectural Border & Margin */}
            <rect
              x="20"
              y="20"
              width="1060"
              height="660"
              fill="none"
              stroke={themeStyles.wallStroke}
              strokeWidth="1.5"
            />
            <rect
              x="25"
              y="25"
              width="1050"
              height="650"
              fill="none"
              stroke={themeStyles.gridLine}
              strokeWidth="0.8"
            />

            {/* Grid Line Coordinates & Bubbles */}
            {/* Vertical Grid Lines: A, B, C, D, E */}
            {[
              { label: 'A', x: 100 },
              { label: 'B', x: 280 },
              { label: 'C', x: 490 },
              { label: 'D', x: 680 },
              { label: 'E', x: 860 },
            ].map((col) => (
              <g key={col.label}>
                <line
                  x1={col.x}
                  y1="50"
                  x2={col.x}
                  y2="570"
                  stroke={themeStyles.gridLine}
                  strokeWidth="0.75"
                  strokeDasharray="6 4"
                />
                {/* Top grid bubble */}
                <circle cx={col.x} cy="42" r="12" fill={themeStyles.svgBg} stroke={themeStyles.gridText} strokeWidth="1" />
                <text
                  x={col.x}
                  y="46"
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill={themeStyles.gridText}
                >
                  {col.label}
                </text>
              </g>
            ))}

            {/* Horizontal Grid Lines: 1, 2, 3, 4 */}
            {[
              { label: '1', y: 100 },
              { label: '2', y: 250 },
              { label: '3', y: 410 },
              { label: '4', y: 560 },
            ].map((row) => (
              <g key={row.label}>
                <line
                  x1="80"
                  y1={row.y}
                  x2="880"
                  y2={row.y}
                  stroke={themeStyles.gridLine}
                  strokeWidth="0.75"
                  strokeDasharray="6 4"
                />
                {/* Left grid bubble */}
                <circle cx="68" cy={row.y} r="12" fill={themeStyles.svgBg} stroke={themeStyles.gridText} strokeWidth="1" />
                <text
                  x="68"
                  y={row.y + 4}
                  fontSize="10"
                  fontWeight="bold"
                  textAnchor="middle"
                  fill={themeStyles.gridText}
                >
                  {row.label}
                </text>
              </g>
            ))}

            {/* Structural Columns (Concrete Piers at grid intersections) */}
            {[
              [100, 100], [280, 100], [490, 100], [680, 100], [860, 100],
              [100, 250], [280, 250], [490, 250], [680, 250], [860, 250],
              [100, 410], [280, 410], [490, 410], [680, 410], [860, 410],
              [100, 560], [280, 560], [490, 560], [680, 560], [860, 560],
            ].map(([cx, cy], i) => (
              <rect
                key={i}
                x={cx - 7}
                y={cy - 7}
                width="14"
                height="14"
                fill={themeStyles.wallStroke}
                stroke={themeStyles.wallStroke}
              />
            ))}

            {/* Perimeter Exterior Cavity Walls */}
            {/* Outer Wall Envelope */}
            <rect
              x="100"
              y="100"
              width="760"
              height="460"
              fill="none"
              stroke={themeStyles.wallStroke}
              strokeWidth="6"
            />
            {/* Internal Wall Hatching/Cavity line */}
            <rect
              x="106"
              y="106"
              width="748"
              height="448"
              fill="none"
              stroke={themeStyles.wallStroke}
              strokeWidth="1"
            />

            {/* Exterior Windows (Fenestrations with mullions) */}
            {/* Top Windows */}
            <g>
              <rect x="340" y="97" width="100" height="6" fill={themeStyles.windowStroke} />
              <line x1="340" y1="100" x2="440" y2="100" stroke="#ffffff" strokeWidth="1" />
              <rect x="540" y="97" width="90" height="6" fill={themeStyles.windowStroke} />
              <line x1="540" y1="100" x2="630" y2="100" stroke="#ffffff" strokeWidth="1" />
            </g>
            {/* Bottom Glazed Sliding Wall */}
            <g>
              <rect x="320" y="557" width="220" height="6" fill={themeStyles.windowStroke} />
              <line x1="320" y1="560" x2="540" y2="560" stroke="#ffffff" strokeWidth="1" />
            </g>

            {/* Interior Partition Walls */}
            {/* Zone Divider 1: Foyer to Living */}
            <line x1="280" y1="100" x2="280" y2="280" stroke={themeStyles.wallStroke} strokeWidth="4" />
            {/* Zone Divider 2: Living to Master Sanctum */}
            <line x1="580" y1="100" x2="580" y2="340" stroke={themeStyles.wallStroke} strokeWidth="4" />
            {/* Zone Divider 3: Living to Kitchen/Dining */}
            <line x1="280" y1="360" x2="280" y2="560" stroke={themeStyles.wallStroke} strokeWidth="4" />
            {/* Zone Divider 4: Master Suite corridor */}
            <line x1="580" y1="340" x2="860" y2="340" stroke={themeStyles.wallStroke} strokeWidth="4" />

            {/* Architectural Door Swings (Arc lines & door panels) */}
            {/* Main Entry Door at Foyer */}
            <g transform="translate(140, 100)">
              {/* Wall opening cutout */}
              <rect x="-1" y="-4" width="42" height="8" fill={themeStyles.svgBg} />
              {/* Door panel at 90 deg */}
              <line x1="0" y1="0" x2="0" y2="40" stroke={themeStyles.doorStroke} strokeWidth="2" />
              {/* Swing arc */}
              <path
                d="M 40 0 A 40 40 0 0 1 0 40"
                fill="none"
                stroke={themeStyles.doorStroke}
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>

            {/* Master Suite Door */}
            <g transform="translate(580, 220)">
              <rect x="-4" y="-1" width="8" height="37" fill={themeStyles.svgBg} />
              <line x1="0" y1="0" x2="35" y2="0" stroke={themeStyles.doorStroke} strokeWidth="2" />
              <path
                d="M 0 35 A 35 35 0 0 0 35 0"
                fill="none"
                stroke={themeStyles.doorStroke}
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>

            {/* Study Suite Door */}
            <g transform="translate(280, 240)">
              <rect x="-4" y="-1" width="8" height="37" fill={themeStyles.svgBg} />
              <line x1="0" y1="0" x2="-35" y2="0" stroke={themeStyles.doorStroke} strokeWidth="2" />
              <path
                d="M 0 35 A 35 35 0 0 1 -35 0"
                fill="none"
                stroke={themeStyles.doorStroke}
                strokeWidth="1"
                strokeDasharray="2 2"
              />
            </g>

            {/* Room Stamps & Zones (Dynamically mapped from customer's brief) */}
            {/* 1. Grand Foyer */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedRoom(zoneAllocations[0]?.name || 'Foyer')}
            >
              <rect
                x="115"
                y="115"
                width="150"
                height="125"
                fill={selectedRoom === zoneAllocations[0]?.name ? '#38bdf820' : 'transparent'}
                rx="4"
              />
              <text x="190" y="160" fontSize="12" fontWeight="bold" textAnchor="middle" fill={themeStyles.roomText}>
                {zoneAllocations[0]?.name.toUpperCase() || 'GRAND FOYER'}
              </text>
              <text x="190" y="176" fontSize="10" textAnchor="middle" fill={themeStyles.roomSubtext}>
                {zoneAllocations[0]?.sqFt || 220} SQ.FT • {zoneAllocations[0]?.level || '+0.00 FFL'}
              </text>
              <text x="190" y="190" fontSize="9" fontStyle="italic" textAnchor="middle" fill={themeStyles.roomSubtext}>
                Spec: {zoneAllocations[0]?.finishCode || 'FL-01 Micro-Cement'}
              </text>
            </g>

            {/* 2. Central Living & Social Forum (Double Height Area) */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedRoom(zoneAllocations[1]?.name || 'Living')}
            >
              <rect
                x="295"
                y="115"
                width="270"
                height="230"
                fill={selectedRoom === zoneAllocations[1]?.name ? '#38bdf820' : 'transparent'}
                rx="4"
              />
              {/* Furniture layout outline: Sectional sofa & coffee table */}
              <rect
                x="340"
                y="140"
                width="180"
                height="100"
                fill="none"
                stroke={themeStyles.gridLine}
                strokeWidth="1"
                strokeDasharray="3 2"
              />
              <circle cx="430" cy="190" r="28" fill="none" stroke={themeStyles.gridLine} strokeWidth="1" />
              <text x="430" y="270" fontSize="13" fontWeight="bold" textAnchor="middle" fill={themeStyles.roomText}>
                {zoneAllocations[1]?.name.toUpperCase() || 'OPEN LIVING & FORMAL DINING'}
              </text>
              <text x="430" y="288" fontSize="10" textAnchor="middle" fill={themeStyles.roomSubtext}>
                {zoneAllocations[1]?.sqFt || 1240} SQ.FT • DOUBLE-HEIGHT ATRIUM
              </text>
              <text x="430" y="303" fontSize="9" fontStyle="italic" textAnchor="middle" fill={themeStyles.roomSubtext}>
                Spec: {zoneAllocations[1]?.finishCode || 'FL-01 Seamless Stone'}
              </text>
            </g>

            {/* 3. Master Sanctuary Suite */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedRoom(zoneAllocations[3]?.name || 'Master')}
            >
              <rect
                x="595"
                y="115"
                width="250"
                height="215"
                fill={selectedRoom === zoneAllocations[3]?.name ? '#38bdf820' : 'transparent'}
                rx="4"
              />
              {/* King Bed Graphic */}
              <rect x="670" y="130" width="100" height="90" fill="none" stroke={themeStyles.gridLine} strokeWidth="1" />
              <rect x="685" y="135" width="30" height="20" fill="none" stroke={themeStyles.gridLine} strokeWidth="0.75" />
              <rect x="725" y="135" width="30" height="20" fill="none" stroke={themeStyles.gridLine} strokeWidth="0.75" />
              <text x="720" y="260" fontSize="12" fontWeight="bold" textAnchor="middle" fill={themeStyles.roomText}>
                {zoneAllocations[3]?.name.toUpperCase() || 'MASTER SANCTUARY SUITE'}
              </text>
              <text x="720" y="277" fontSize="10" textAnchor="middle" fill={themeStyles.roomSubtext}>
                {zoneAllocations[3]?.sqFt || 880} SQ.FT • ACOUSTIC STC-55
              </text>
              <text x="720" y="292" fontSize="9" fontStyle="italic" textAnchor="middle" fill={themeStyles.roomSubtext}>
                Spec: {zoneAllocations[3]?.finishCode || 'FL-02 Parquet'}
              </text>
            </g>

            {/* 4. Show Kitchen & Wet Scullery */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedRoom(zoneAllocations[2]?.name || 'Kitchen')}
            >
              <rect
                x="115"
                y="370"
                width="150"
                height="175"
                fill={selectedRoom === zoneAllocations[2]?.name ? '#38bdf820' : 'transparent'}
                rx="4"
              />
              {/* Island counter */}
              <rect x="135" y="420" width="110" height="40" fill="none" stroke={themeStyles.gridLine} strokeWidth="1" />
              <text x="190" y="490" fontSize="12" fontWeight="bold" textAnchor="middle" fill={themeStyles.roomText}>
                {zoneAllocations[2]?.name.toUpperCase() || 'SHOW KITCHEN'}
              </text>
              <text x="190" y="506" fontSize="10" textAnchor="middle" fill={themeStyles.roomSubtext}>
                {zoneAllocations[2]?.sqFt || 480} SQ.FT • {zoneAllocations[2]?.level || '+0.00'}
              </text>
            </g>

            {/* 5. Library / Study Suite */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedRoom(zoneAllocations[4]?.name || 'Library')}
            >
              <rect
                x="295"
                y="370"
                width="270"
                height="175"
                fill={selectedRoom === zoneAllocations[4]?.name ? '#38bdf820' : 'transparent'}
                rx="4"
              />
              <text x="430" y="450" fontSize="12" fontWeight="bold" textAnchor="middle" fill={themeStyles.roomText}>
                {zoneAllocations[4]?.name.toUpperCase() || 'EXECUTIVE LIBRARY / STUDY'}
              </text>
              <text x="430" y="468" fontSize="10" textAnchor="middle" fill={themeStyles.roomSubtext}>
                {zoneAllocations[4]?.sqFt || 520} SQ.FT • CUSTOM MILLWORK
              </text>
            </g>

            {/* 6. Guest Suite / Balcony Verandah */}
            <g
              className="cursor-pointer"
              onClick={() => setSelectedRoom(zoneAllocations[5]?.name || 'Guest Suite')}
            >
              <rect
                x="595"
                y="355"
                width="250"
                height="190"
                fill={selectedRoom === zoneAllocations[5]?.name ? '#38bdf820' : 'transparent'}
                rx="4"
              />
              <text x="720" y="450" fontSize="12" fontWeight="bold" textAnchor="middle" fill={themeStyles.roomText}>
                {zoneAllocations[5]?.name.toUpperCase() || 'GUEST WING & BALCONY'}
              </text>
              <text x="720" y="468" fontSize="10" textAnchor="middle" fill={themeStyles.roomSubtext}>
                {zoneAllocations[5]?.sqFt || 460} SQ.FT • ENSUITE BATH
              </text>
            </g>

            {/* Dimension Chains */}
            {/* Top Overall Dimension String */}
            <g>
              <line x1="100" y1="75" x2="860" y2="75" stroke={themeStyles.dimensionLine} strokeWidth="1" />
              <line x1="100" y1="70" x2="100" y2="80" stroke={themeStyles.dimensionLine} strokeWidth="1" />
              <line x1="860" y1="70" x2="860" y2="80" stroke={themeStyles.dimensionLine} strokeWidth="1" />
              <text
                x="480"
                y="70"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                fill={themeStyles.dimensionText}
              >
                OVERALL STRUCTURAL SPAN: 24,000 mm [78&apos;-8&quot;]
              </text>
            </g>

            {/* Right Side Vertical Dimension String */}
            <g>
              <line x1="885" y1="100" x2="885" y2="560" stroke={themeStyles.dimensionLine} strokeWidth="1" />
              <line x1="880" y1="100" x2="890" y2="100" stroke={themeStyles.dimensionLine} strokeWidth="1" />
              <line x1="880" y1="560" x2="890" y2="560" stroke={themeStyles.dimensionLine} strokeWidth="1" />
              <text
                x="895"
                y="335"
                fontSize="10"
                fontWeight="bold"
                textAnchor="middle"
                transform="rotate(90, 895, 335)"
                fill={themeStyles.dimensionText}
              >
                OVERALL DEPTH: 14,500 mm [47&apos;-6&quot;]
              </text>
            </g>

            {/* North Arrow Symbol */}
            <g transform="translate(970, 80)">
              <circle cx="0" cy="0" r="22" fill={themeStyles.svgBg} stroke={themeStyles.wallStroke} strokeWidth="1.5" />
              {/* North Arrow Pointer */}
              <polygon points="0,-18 7,12 0,6" fill={themeStyles.wallStroke} />
              <polygon points="0,-18 -7,12 0,6" fill="none" stroke={themeStyles.wallStroke} strokeWidth="1" />
              <text x="0" y="-24" fontSize="11" fontWeight="bold" textAnchor="middle" fill={themeStyles.roomText}>
                N
              </text>
              <text x="0" y="32" fontSize="8" textAnchor="middle" fill={themeStyles.roomSubtext}>
                TRUE NORTH
              </text>
            </g>

            {/* Graphical Metric Scale Bar */}
            <g transform="translate(930, 160)">
              <text x="0" y="-8" fontSize="8" fontWeight="bold" fill={themeStyles.roomSubtext}>
                GRAPHIC SCALE (1:100 @ A3)
              </text>
              <rect x="0" y="0" width="20" height="5" fill={themeStyles.wallStroke} />
              <rect x="20" y="0" width="20" height="5" fill={themeStyles.svgBg} stroke={themeStyles.wallStroke} strokeWidth="0.5" />
              <rect x="40" y="0" width="30" height="5" fill={themeStyles.wallStroke} />
              <rect x="70" y="0" width="40" height="5" fill={themeStyles.svgBg} stroke={themeStyles.wallStroke} strokeWidth="0.5" />
              <text x="0" y="14" fontSize="7" fill={themeStyles.roomSubtext}>0m</text>
              <text x="20" y="14" fontSize="7" fill={themeStyles.roomSubtext}>2m</text>
              <text x="40" y="14" fontSize="7" fill={themeStyles.roomSubtext}>4m</text>
              <text x="70" y="14" fontSize="7" fill={themeStyles.roomSubtext}>7m</text>
              <text x="110" y="14" fontSize="7" fill={themeStyles.roomSubtext}>10m</text>
            </g>

            {/* Standard Architectural Title Block (Bottom Right corner) */}
            <g transform="translate(25, 595)">
              <rect
                x="0"
                y="0"
                width="1050"
                height="80"
                fill={themeStyles.titleBlockBg}
                stroke={themeStyles.wallStroke}
                strokeWidth="1"
              />
              {/* Vertical divider columns */}
              <line x1="220" y1="0" x2="220" y2="80" stroke={themeStyles.wallStroke} strokeWidth="0.8" />
              <line x1="560" y1="0" x2="560" y2="80" stroke={themeStyles.wallStroke} strokeWidth="0.8" />
              <line x1="820" y1="0" x2="820" y2="80" stroke={themeStyles.wallStroke} strokeWidth="0.8" />

              {/* Col 1: Practice & Firm */}
              <text x="15" y="24" fontSize="12" fontWeight="bold" fill={themeStyles.titleBlockText}>
                ARCHCRM ARCHITECTURAL GROUP
              </text>
              <text x="15" y="42" fontSize="9" fill={themeStyles.roomSubtext}>
                Chartered Practice • GFC Technical Delivery
              </text>
              <text x="15" y="58" fontSize="8" fill={themeStyles.roomSubtext}>
                ISO 9001 / BIM Level 2 Standards Compliant
              </text>

              {/* Col 2: Project & Client */}
              <text x="235" y="20" fontSize="9" fontWeight="bold" fill={themeStyles.roomSubtext}>
                PROJECT &amp; CLIENT INFORMATION
              </text>
              <text x="235" y="38" fontSize="13" fontWeight="bold" fill={themeStyles.titleBlockText}>
                {clientName}
              </text>
              <text x="235" y="54" fontSize="10" fill={themeStyles.roomSubtext}>
                Total Built-Up Area: {builtUpAreaSqFt.toLocaleString()} sq.ft ({Math.round(builtUpAreaSqFt * 0.0929)} m²)
              </text>
              <text x="235" y="68" fontSize="9" fill={themeStyles.roomSubtext}>
                Site Envelope: ~{Math.round(siteAreaSqFt).toLocaleString()} sq.ft • Style: {concept.themeStyle}
              </text>

              {/* Col 3: Drawing Title & Status */}
              <text x="575" y="20" fontSize="9" fontWeight="bold" fill={themeStyles.roomSubtext}>
                DRAWING SHEET TITLE
              </text>
              <text x="575" y="38" fontSize="12" fontWeight="bold" fill={themeStyles.titleBlockText}>
                ARCHITECTURAL SPACE PLANNING &amp; GFC LAYOUT
              </text>
              <text x="575" y="54" fontSize="10" fill="#10b981" fontWeight="bold">
                STATUS: FOR CLIENT REVIEW &amp; APPROVAL
              </text>
              <text x="575" y="68" fontSize="9" fill={themeStyles.roomSubtext}>
                Concept Option 0{concept.optionNumber} Implementation
              </text>

              {/* Col 4: Metadata (Sheet no, scale, rev) */}
              <text x="835" y="22" fontSize="14" fontWeight="bold" fill={themeStyles.titleBlockText}>
                SHEET: {drawingNumber}
              </text>
              <text x="835" y="40" fontSize="10" fill={themeStyles.roomSubtext}>
                SCALE: {scale} • SIZE: ISO A3
              </text>
              <text x="835" y="54" fontSize="10" fill={themeStyles.roomSubtext}>
                REVISION: {revision} • DATE: {sheetDate}
              </text>
              <text x="835" y="68" fontSize="9" fill={themeStyles.roomSubtext}>
                DRAWN: ArchCRM Studio • CHECKED: Lead Arch
              </text>
            </g>
          </svg>
        </div>
      ) : (
        /* High-Res Raster CAD Plan View */
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-md relative group">
          <div
            className="relative w-full aspect-16/9 bg-slate-900 overflow-hidden cursor-pointer"
            onClick={onOpenLightbox}
          >
            <img
              src={asset?.imageUrl || '/cad_floor_plan.jpg'}
              alt={asset?.title || 'CAD Floor Plan'}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

            <div className="absolute top-3 left-3 flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono bg-black/70 text-indigo-300 border border-indigo-500/30 backdrop-blur-md">
                CAD Floor Plan Render
              </span>
              <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-black/60 text-slate-300 backdrop-blur-md border border-white/10">
                {drawingNumber} • {scale}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
              <div className="max-w-2xl bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {asset?.title || 'Architectural CAD Floor Plan Drawing'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                  {asset?.subtitle || `Architectural drawing sheet for ${clientName} (${builtUpAreaSqFt.toLocaleString()} sq.ft)`}
                </p>
              </div>

              <span className="text-[11px] font-semibold text-amber-300 bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-md border border-amber-500/30">
                Click to Enlarge
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Room Zones Schedule Summary Bar */}
      <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center space-x-2">
            <Ruler className="w-3.5 h-3.5 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Space Allocation Schedule (Customer Requirements Verified)
            </h4>
          </div>
          <span className="text-[11px] text-slate-500">
            Total Built-Up Area: <strong className="text-slate-800">{builtUpAreaSqFt.toLocaleString()} sq.ft</strong>
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
          {zoneAllocations.map((z, i) => (
            <div
              key={i}
              onClick={() => setSelectedRoom(z.name)}
              className={`p-2 rounded-lg border text-xs cursor-pointer transition-all ${
                selectedRoom === z.name
                  ? 'bg-indigo-50 border-indigo-300 ring-1 ring-indigo-400'
                  : 'bg-white border-slate-200 hover:border-slate-300'
              }`}
            >
              <span className="text-[10px] text-slate-400 font-mono block truncate">{z.finishCode}</span>
              <p className="font-semibold text-slate-800 text-[11px] truncate mt-0.5">{z.name}</p>
              <p className="text-[11px] text-indigo-700 font-bold mt-0.5">{z.sqFt.toLocaleString()} sq.ft</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
