import React, { useState } from 'react';
import {
  Compass,
  Sun,
  Wind,
  Download,
  Maximize2,
  Layers,
  ArrowUpRight,
  Info,
  CheckCircle2,
  Upload,
  FileImage,
} from 'lucide-react';
import { ConceptOption, ArchitecturalVisualAsset } from '../../types';

interface MassingSchematicSheetProps {
  concept: ConceptOption;
  asset?: ArchitecturalVisualAsset;
  clientName: string;
  builtUpAreaSqFt: number;
  onUploadMassing?: (fileDataUrl: string, fileName: string) => void;
  onOpenLightbox?: () => void;
}

export const MassingSchematicSheet: React.FC<MassingSchematicSheetProps> = ({
  concept,
  asset,
  clientName,
  builtUpAreaSqFt,
  onUploadMassing,
  onOpenLightbox,
}) => {
  const [viewMode, setViewMode] = useState<'vector_diagram' | 'uploaded_render'>(
    asset?.imageUrl ? 'uploaded_render' : 'vector_diagram'
  );
  const [selectedBlock, setSelectedBlock] = useState<string | null>('living');
  const [showSolarVector, setShowSolarVector] = useState<boolean>(true);
  const [showWindVector, setShowWindVector] = useState<boolean>(true);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadMassing) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUploadMassing(event.target.result as string, file.name);
          setViewMode('uploaded_render');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Compute proportional spatial program
  const livingSqFt = Math.round(builtUpAreaSqFt * 0.42);
  const masterSqFt = Math.round(builtUpAreaSqFt * 0.28);
  const culinarySqFt = Math.round(builtUpAreaSqFt * 0.18);
  const courtyardSqFt = Math.round(builtUpAreaSqFt * 0.12);

  const blocks = [
    {
      id: 'living',
      name: 'Double-Height Social Forum & Atrium',
      sqFt: livingSqFt,
      pct: 42,
      clearance: '4.80m [15\'-9"] Volume',
      color: '#3b82f6',
      fillTop: '#60a5fa',
      fillLeft: '#2563eb',
      fillRight: '#1d4ed8',
      description: 'Primary public living volume capturing southern daylight with floor-to-ceiling fenestration.',
    },
    {
      id: 'master',
      name: 'Master Sanctuary Suite & Private Wing',
      sqFt: masterSqFt,
      pct: 28,
      clearance: '3.10m [10\'-2"] Acoustic Core',
      color: '#6366f1',
      fillTop: '#818cf8',
      fillLeft: '#4f46e5',
      fillRight: '#4338ca',
      description: 'Quiet buffer zone shielded from street noise with STC-55 acoustic envelope and ensuite garden.',
    },
    {
      id: 'culinary',
      name: 'Gourmet Culinary Core & Scullery',
      sqFt: culinarySqFt,
      pct: 18,
      clearance: '2.85m [9\'-4"] Ducted Plenum',
      color: '#10b981',
      fillTop: '#34d399',
      fillLeft: '#059669',
      fillRight: '#047857',
      description: 'High-performance culinary workspace directly connected to the formal dining and service ingress.',
    },
    {
      id: 'courtyard',
      name: 'Biophilic Daylight Atrium & Lightwell',
      sqFt: courtyardSqFt,
      pct: 12,
      clearance: 'Open Sky Courtyard Well',
      color: '#f59e0b',
      fillTop: '#fbbf24',
      fillLeft: '#d97706',
      fillRight: '#b45309',
      description: 'Microclimatic internal lightwell delivering passive cross-ventilation and natural biophilia.',
    },
  ];

  const activeBlockData = blocks.find((b) => b.id === selectedBlock) || blocks[0];

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById('massing-vector-sheet');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `DWG-MASS-301_Massing_Schematic_${clientName.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {/* Massing Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 text-white border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Compass className="w-4 h-4 text-cyan-400" />
          <span className="font-semibold text-slate-200">
            Architectural Massing &amp; Volumetric Spatial Program
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-cyan-300 font-mono">DWG-MASS-301</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode switch if image exists */}
          {asset?.imageUrl && (
            <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
              <button
                type="button"
                onClick={() => setViewMode('vector_diagram')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                  viewMode === 'vector_diagram'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>Vector Axonometric</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('uploaded_render')}
                className={`px-2 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                  viewMode === 'uploaded_render'
                    ? 'bg-cyan-500 text-slate-950 font-bold'
                    : 'text-slate-300 hover:text-white'
                }`}
              >
                <FileImage className="w-3 h-3" />
                <span>Uploaded Study</span>
              </button>
            </div>
          )}

          {viewMode === 'vector_diagram' && (
            <>
              <button
                type="button"
                onClick={() => setShowSolarVector(!showSolarVector)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  showSolarVector
                    ? 'bg-amber-400 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Sun className="w-3.5 h-3.5" />
                <span>Solar Path</span>
              </button>

              <button
                type="button"
                onClick={() => setShowWindVector(!showWindVector)}
                className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  showWindVector
                    ? 'bg-cyan-400 text-slate-950 font-bold'
                    : 'bg-slate-800 text-slate-300 hover:text-white'
                }`}
              >
                <Wind className="w-3.5 h-3.5" />
                <span>Breeze Vectors</span>
              </button>

              <button
                type="button"
                onClick={handleDownloadSVG}
                className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
              >
                <Download className="w-3 h-3 text-emerald-400" />
                <span>Export SVG</span>
              </button>
            </>
          )}

          {/* Upload Massing Study Image */}
          <label className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 cursor-pointer transition-colors font-bold">
            <Upload className="w-3 h-3" />
            <span>Upload Massing Study</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {viewMode === 'uploaded_render' && asset?.imageUrl ? (
        /* Uploaded Massing Image View */
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-md relative group">
          <div className="relative w-full aspect-16/9 bg-slate-900 overflow-hidden">
            <img
              src={asset.imageUrl}
              alt={asset.title || 'Massing Study'}
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute top-3 left-3 flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono bg-black/70 text-cyan-300 border border-cyan-500/30 backdrop-blur-md">
                Custom Uploaded Massing Study
              </span>
              {asset.approvalStatus === 'draft_pending_approval' && (
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500/90 text-slate-950 backdrop-blur-md">
                  Draft (Pending Approval)
                </span>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* 3D Axonometric Massing Graphic Canvas */
        <div className="rounded-2xl border border-slate-200 p-4 bg-slate-950 shadow-sm overflow-x-auto">
        <svg
          id="massing-vector-sheet"
          viewBox="0 0 1000 580"
          className="w-full h-auto min-w-[700px] select-none font-sans"
        >
          {/* Subtle Isometric Ground Grid */}
          <g opacity="0.15">
            {[-3, -2, -1, 0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={`grid-1-${i}`}
                x1={100 + i * 80}
                y1="380"
                x2={500 + i * 80}
                y2="520"
                stroke="#38bdf8"
                strokeWidth="1"
              />
            ))}
            {[-3, -2, -1, 0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={`grid-2-${i}`}
                x1={500 + i * 80}
                y1="380"
                x2={100 + i * 80}
                y2="520"
                stroke="#38bdf8"
                strokeWidth="1"
              />
            ))}
          </g>

          {/* Site Footprint Boundary Box */}
          <polygon
            points="180,450 500,340 820,450 500,560"
            fill="#0f172a"
            stroke="#38bdf8"
            strokeWidth="1.5"
            strokeDasharray="4 4"
            opacity="0.6"
          />
          <text x="500" y="550" fontSize="10" fill="#94a3b8" textAnchor="middle" fontWeight="bold">
            SITE PROPERTY BOUNDARY ENVELOPE (~{Math.round(builtUpAreaSqFt * 1.3).toLocaleString()} SQ.FT)
          </text>

          {/* Environmental Vectors */}
          {/* Solar Path Arc (Yellow/Orange) */}
          {showSolarVector && (
            <g>
              <path
                d="M 160 380 Q 500 120 840 380"
                fill="none"
                stroke="#f59e0b"
                strokeWidth="2.5"
                strokeDasharray="6 4"
              />
              {/* Sun at Midday Zenith */}
              <circle cx="500" cy="180" r="16" fill="#fbbf24" stroke="#d97706" strokeWidth="2" />
              <text x="500" y="150" fontSize="10" fontWeight="bold" fill="#fbbf24" textAnchor="middle">
                SOLAR ZENITH (12:00 PM) - 62° ELEVATION
              </text>
              <text x="170" y="405" fontSize="9" fontWeight="bold" fill="#fbbf24">
                EAST: MORNING SUN
              </text>
              <text x="760" y="405" fontSize="9" fontWeight="bold" fill="#fbbf24">
                WEST: SHADED BUFFER
              </text>
            </g>
          )}

          {/* Prevailing Breeze Arrows (Cyan) */}
          {showWindVector && (
            <g opacity="0.85">
              {/* Breeze stream 1 */}
              <path d="M 120 480 Q 300 450 480 390" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <polygon points="480,390 465,395 470,402" fill="#38bdf8" />
              {/* Breeze stream 2 */}
              <path d="M 220 530 Q 380 500 560 440" fill="none" stroke="#38bdf8" strokeWidth="2" />
              <polygon points="560,440 545,445 550,452" fill="#38bdf8" />
              <text x="140" y="520" fontSize="10" fontWeight="bold" fill="#38bdf8">
                SOUTH-WEST NATURAL VENTILATION STREAM
              </text>
            </g>
          )}

          {/* 3D Isometric Volumetric Blocks */}

          {/* Block 1: Culinary & Service Core (Back Left) */}
          <g
            className="cursor-pointer transition-transform hover:opacity-90"
            onClick={() => setSelectedBlock('culinary')}
          >
            {/* Left face */}
            <polygon points="300,320 400,355 400,435 300,400" fill="#059669" stroke="#0f172a" strokeWidth="1" />
            {/* Right face */}
            <polygon points="400,355 500,320 500,400 400,435" fill="#047857" stroke="#0f172a" strokeWidth="1" />
            {/* Top face */}
            <polygon points="400,275 500,320 400,355 300,320" fill="#34d399" stroke="#0f172a" strokeWidth="1" />
            {selectedBlock === 'culinary' && (
              <polygon points="400,275 500,320 400,355 300,320" fill="none" stroke="#ffffff" strokeWidth="2.5" />
            )}
            <text x="400" y="325" fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">
              CULINARY CORE
            </text>
          </g>

          {/* Block 2: Courtyard / Daylight Core (Back Right) */}
          <g
            className="cursor-pointer transition-transform hover:opacity-90"
            onClick={() => setSelectedBlock('courtyard')}
          >
            <polygon points="520,320 620,355 620,435 520,400" fill="#d97706" stroke="#0f172a" strokeWidth="1" />
            <polygon points="620,355 720,320 720,400 620,435" fill="#b45309" stroke="#0f172a" strokeWidth="1" />
            <polygon points="620,285 720,320 620,355 520,320" fill="#fbbf24" stroke="#0f172a" strokeWidth="1" />
            {selectedBlock === 'courtyard' && (
              <polygon points="620,285 720,320 620,355 520,320" fill="none" stroke="#ffffff" strokeWidth="2.5" />
            )}
            <text x="620" y="330" fontSize="11" fontWeight="bold" fill="#0f172a" textAnchor="middle">
              LIGHTWELL ATRIUM
            </text>
          </g>

          {/* Block 3: Double-Height Living Forum (Front Left - Tallest) */}
          <g
            className="cursor-pointer transition-transform hover:opacity-90"
            onClick={() => setSelectedBlock('living')}
          >
            {/* Left face */}
            <polygon points="260,250 420,310 420,440 260,380" fill="#2563eb" stroke="#0f172a" strokeWidth="1.5" />
            {/* Right face */}
            <polygon points="420,310 580,250 580,380 420,440" fill="#1d4ed8" stroke="#0f172a" strokeWidth="1.5" />
            {/* Top face */}
            <polygon points="420,180 580,250 420,310 260,250" fill="#60a5fa" stroke="#0f172a" strokeWidth="1.5" />
            {selectedBlock === 'living' && (
              <polygon points="420,180 580,250 420,310 260,250" fill="none" stroke="#ffffff" strokeWidth="3" />
            )}
            <text x="420" y="255" fontSize="13" fontWeight="bold" fill="#0f172a" textAnchor="middle">
              DOUBLE-HEIGHT LIVING FORUM
            </text>
            <text x="420" y="272" fontSize="9" fontWeight="bold" fill="#1e293b" textAnchor="middle">
              4.8m High Ceiling Volume
            </text>
          </g>

          {/* Block 4: Master Sanctuary Suite (Front Right) */}
          <g
            className="cursor-pointer transition-transform hover:opacity-90"
            onClick={() => setSelectedBlock('master')}
          >
            {/* Left face */}
            <polygon points="560,290 680,335 680,455 560,410" fill="#4f46e5" stroke="#0f172a" strokeWidth="1.5" />
            {/* Right face */}
            <polygon points="680,335 800,290 800,410 680,455" fill="#4338ca" stroke="#0f172a" strokeWidth="1.5" />
            {/* Top face */}
            <polygon points="680,240 800,290 680,335 560,290" fill="#818cf8" stroke="#0f172a" strokeWidth="1.5" />
            {selectedBlock === 'master' && (
              <polygon points="680,240 800,290 680,335 560,290" fill="none" stroke="#ffffff" strokeWidth="3" />
            )}
            <text x="680" y="295" fontSize="12" fontWeight="bold" fill="#0f172a" textAnchor="middle">
              MASTER SANCTUARY
            </text>
            <text x="680" y="310" fontSize="8" fontWeight="bold" fill="#1e293b" textAnchor="middle">
              Acoustic STC-55 Core
            </text>
          </g>

          {/* Architectural North Arrow & Compass */}
          <g transform="translate(900, 80)">
            <circle cx="0" cy="0" r="24" fill="#0f172a" stroke="#38bdf8" strokeWidth="1.5" />
            <polygon points="0,-20 8,14 0,7" fill="#38bdf8" />
            <polygon points="0,-20 -8,14 0,7" fill="#0f172a" stroke="#38bdf8" strokeWidth="1" />
            <text x="0" y="-26" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#38bdf8">
              N
            </text>
            <text x="0" y="36" fontSize="8" textAnchor="middle" fill="#94a3b8">
              34° SOLAR AXIS
            </text>
          </g>
        </svg>
      </div>
      )}

      {/* Interactive Massing Program Schedule Table */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Layers className="w-4 h-4 text-indigo-600" />
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Spatial Volume Allocation Breakdown
            </h4>
          </div>
          <span className="text-xs text-slate-500">
            Click any block above or below to inspect volume characteristics
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {blocks.map((block) => (
            <div
              key={block.id}
              onClick={() => setSelectedBlock(block.id)}
              className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                selectedBlock === block.id
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: block.color }}
                />
                <span
                  className={`text-[11px] font-mono font-bold ${
                    selectedBlock === block.id ? 'text-amber-300' : 'text-slate-500'
                  }`}
                >
                  {block.pct}% ENVELOPE
                </span>
              </div>

              <h5 className="text-xs font-bold leading-tight line-clamp-1">{block.name}</h5>

              <p
                className={`text-sm font-extrabold mt-1 ${
                  selectedBlock === block.id ? 'text-cyan-300' : 'text-indigo-700'
                }`}
              >
                {block.sqFt.toLocaleString()} sq.ft
              </p>

              <span
                className={`text-[10px] block mt-1 ${
                  selectedBlock === block.id ? 'text-slate-300' : 'text-slate-500'
                }`}
              >
                {block.clearance}
              </span>
            </div>
          ))}
        </div>

        {/* Selected Block Narrative Description */}
        <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start space-x-2.5">
          <Info className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
          <div className="text-xs">
            <strong className="text-slate-900">{activeBlockData.name}: </strong>
            <span className="text-slate-600">{activeBlockData.description}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
