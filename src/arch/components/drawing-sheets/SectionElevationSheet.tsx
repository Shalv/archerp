import React, { useState } from 'react';
import {
  Layers,
  Download,
  Upload,
  Maximize2,
  FileCode,
  Eye,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { ConceptOption, ArchitecturalVisualAsset } from '../../types';

interface SectionElevationSheetProps {
  concept: ConceptOption;
  asset?: ArchitecturalVisualAsset;
  clientName: string;
  builtUpAreaSqFt: number;
  onUploadSection?: (fileDataUrl: string, fileName: string) => void;
  onOpenLightbox?: () => void;
}

export const SectionElevationSheet: React.FC<SectionElevationSheetProps> = ({
  concept,
  asset,
  clientName,
  builtUpAreaSqFt,
  onUploadSection,
  onOpenLightbox,
}) => {
  const [viewMode, setViewMode] = useState<'vector_section' | 'render_image'>('vector_section');
  const [activeDatum, setActiveDatum] = useState<string | null>(null);

  const drawingNumber = asset?.drawingNumber || `DWG-SEC-20${concept.optionNumber}`;
  const scale = asset?.scale || '1:50 @ A3';
  const revision = asset?.revision || 'Rev A';
  const sheetDate = new Date().toISOString().split('T')[0];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadSection) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUploadSection(event.target.result as string, file.name);
          setViewMode('render_image');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDownloadSVG = () => {
    const svgEl = document.getElementById('section-vector-sheet');
    if (!svgEl) return;
    const svgData = new XMLSerializer().serializeToString(svgEl);
    const blob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${drawingNumber}_Section_Elevation_${clientName.replace(/\s+/g, '_')}.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-3">
      {/* Section Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 text-white border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <span className="font-mono font-bold text-emerald-400 px-2 py-0.5 rounded bg-slate-800 text-[11px]">
            {drawingNumber}
          </span>
          <span className="font-semibold text-slate-200">
            Architectural Technical Section &amp; Elevation Detail
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-slate-400">Scale {scale}</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode switch */}
          <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => setViewMode('vector_section')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                viewMode === 'vector_section'
                  ? 'bg-emerald-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <FileCode className="w-3 h-3" />
              <span>Technical Section CAD</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode('render_image')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                viewMode === 'render_image'
                  ? 'bg-emerald-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Eye className="w-3 h-3" />
              <span>Section Sheet Print</span>
            </button>
          </div>

          {viewMode === 'vector_section' ? (
            <button
              type="button"
              onClick={handleDownloadSVG}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
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

          <label className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-white cursor-pointer transition-colors font-semibold">
            <Upload className="w-3 h-3" />
            <span>Upload Section File</span>
            <input
              type="file"
              accept="image/*,.dwg,.dxf,.pdf"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Main Section Canvas */}
      {viewMode === 'vector_section' ? (
        <div className="rounded-2xl border border-slate-300 p-3 md:p-5 overflow-x-auto shadow-sm bg-white">
          <svg
            id="section-vector-sheet"
            viewBox="0 0 1100 680"
            className="w-full h-auto min-w-[700px] select-none font-sans"
            style={{ backgroundColor: '#ffffff' }}
          >
            {/* Outer Sheet Border & Margin */}
            <rect x="20" y="20" width="1060" height="640" fill="none" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="25" y="25" width="1050" height="630" fill="none" stroke="#e2e8f0" strokeWidth="0.8" />

            {/* Datum Levels with Target Benchmark Symbols on Left */}
            {[
              { level: '+4.10m', label: 'PARAPET / ROOF SLAB TOP', y: 90 },
              { level: '+3.40m', label: 'STRUCTURAL SLAB BOTTOM SOFFIT', y: 160 },
              { level: '+2.85m', label: 'FALSE CEILING & HVAC PLENUM DATUM', y: 220 },
              { level: '+0.45m', label: 'FINISHED FLOOR LEVEL (FFL)', y: 470 },
              { level: '±0.00m', label: 'NATURAL GROUND LEVEL (NGL)', y: 530 },
            ].map((datum, idx) => (
              <g
                key={idx}
                className="cursor-pointer"
                onClick={() => setActiveDatum(datum.level)}
              >
                {/* Horizontal Datum Line across section */}
                <line
                  x1="160"
                  y1={datum.y}
                  x2="880"
                  y2={datum.y}
                  stroke={activeDatum === datum.level ? '#059669' : '#94a3b8'}
                  strokeWidth={activeDatum === datum.level ? '1.5' : '0.8'}
                  strokeDasharray="6 3"
                />
                {/* Benchmark target symbol */}
                <g transform={`translate(140, ${datum.y})`}>
                  <circle cx="0" cy="0" r="10" fill="#ffffff" stroke="#0f172a" strokeWidth="1" />
                  <path d="M 0 -10 L 0 10 M -10 0 L 10 0" stroke="#0f172a" strokeWidth="1" />
                  <path d="M 0 -10 A 10 10 0 0 1 10 0 L 0 0 Z" fill="#0f172a" />
                  <path d="M 0 10 A 10 10 0 0 1 -10 0 L 0 0 Z" fill="#0f172a" />
                </g>
                {/* Text labels */}
                <text x="120" y={datum.y - 4} fontSize="10" fontWeight="bold" textAnchor="end" fill="#0f172a">
                  {datum.level}
                </text>
                <text x="120" y={datum.y + 8} fontSize="8" textAnchor="end" fill="#64748b">
                  {datum.label}
                </text>
              </g>
            ))}

            {/* Vertical Foundation & Ground Cut */}
            <rect x="180" y="530" width="700" height="30" fill="#e2e8f0" stroke="#0f172a" strokeWidth="1" />
            <text x="530" y="550" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#64748b">
              COMPACTED EARTH &amp; STONE SOLING BASE (SUBGRADE)
            </text>

            {/* Concrete Ground Slab (+0.00m to +0.45m) */}
            <rect x="180" y="470" width="700" height="60" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
            <text x="530" y="505" fontSize="11" fontWeight="bold" textAnchor="middle" fill="#1e293b">
              150mm R.C.C. SLAB + 50mm SCREED BED + FLOOR FINISH ({concept.materials[0]?.material || 'Micro-cement'})
            </text>

            {/* Structural Concrete Columns (Left, Middle, Right) */}
            <rect x="180" y="160" width="30" height="310" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="520" y="160" width="25" height="310" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />
            <rect x="850" y="160" width="30" height="310" fill="#94a3b8" stroke="#0f172a" strokeWidth="1.5" />

            {/* Structural Upper Slab (+3.40m to +3.65m) */}
            <rect x="180" y="135" width="700" height="25" fill="#cbd5e1" stroke="#0f172a" strokeWidth="1.5" />
            <text x="530" y="152" fontSize="10" fontWeight="bold" textAnchor="middle" fill="#1e293b">
              150mm R.C.C. SUSPENDED ROOF SLAB WITH REINFORCING REBAR
            </text>

            {/* Suspended False Ceiling Assembly (+2.85m) */}
            {/* Ceiling hanger rods */}
            {[250, 320, 390, 460, 600, 680, 760, 820].map((rx, idx) => (
              <line key={idx} x1={rx} y1="160" x2={rx} y2="220" stroke="#94a3b8" strokeWidth="1" strokeDasharray="2 2" />
            ))}
            {/* False Ceiling Board */}
            <rect x="210" y="216" width="310" height="8" fill="#f1f5f9" stroke="#0f172a" strokeWidth="1" />
            <rect x="545" y="216" width="305" height="8" fill="#f1f5f9" stroke="#0f172a" strokeWidth="1" />

            {/* Recessed Cove Light Channels with LED glow */}
            <rect x="350" y="212" width="60" height="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            <rect x="680" y="212" width="60" height="4" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.8" />
            <text x="380" y="206" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#ca8a04">
              2700K WARM COVE LED
            </text>
            <text x="710" y="206" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#ca8a04">
              2700K WARM COVE LED
            </text>

            {/* Ducted HVAC distribution plenum in ceiling void */}
            <rect x="260" y="172" width="70" height="36" fill="#e0f2fe" stroke="#0284c7" strokeWidth="1" />
            <line x1="260" y1="172" x2="330" y2="208" stroke="#0284c7" strokeWidth="0.75" />
            <line x1="260" y1="208" x2="330" y2="172" stroke="#0284c7" strokeWidth="0.75" />
            <text x="295" y="194" fontSize="8" fontWeight="bold" textAnchor="middle" fill="#0369a1">
              SUPPLY AIR DUCT
            </text>

            {/* Internal Rooms Section Cut: Left Forum vs Right Master Suite */}
            {/* Room 1: Living & Entertaining Forum */}
            <text x="365" y="320" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#0f172a">
              CENTRAL LIVING FORUM
            </text>
            <text x="365" y="340" fontSize="10" textAnchor="middle" fill="#64748b">
              Clear Ceiling Clearance: 2,850 mm (9&apos;-4&quot;)
            </text>
            <text x="365" y="358" fontSize="9" fontStyle="italic" textAnchor="middle" fill="#059669">
              {concept.architecturalNarrative.slice(0, 55)}...
            </text>

            {/* Room 2: Master Sanctum & Walk-in Suite */}
            <text x="700" y="320" fontSize="14" fontWeight="bold" textAnchor="middle" fill="#0f172a">
              MASTER SANCTUARY SUITE
            </text>
            <text x="700" y="340" fontSize="10" textAnchor="middle" fill="#64748b">
              Acoustic Stud Assembly: STC-55 Rating
            </text>
            <text x="700" y="358" fontSize="9" fontStyle="italic" textAnchor="middle" fill="#6366f1">
              Joinery: {concept.materials[1]?.material || 'Rift White Oak Millwork'}
            </text>

            {/* Material Specification Leader Lines */}
            {/* Ceiling leader */}
            <line x1="430" y1="220" x2="480" y2="250" stroke="#0f172a" strokeWidth="1" />
            <circle cx="430" cy="220" r="3" fill="#0f172a" />
            <text x="485" y="254" fontSize="9" fontWeight="bold" fill="#0f172a">
              SPEC: {concept.materials[2]?.material || 'Acoustic Slat Board'}
            </text>

            {/* Flooring leader */}
            <line x1="430" y1="470" x2="480" y2="440" stroke="#0f172a" strokeWidth="1" />
            <circle cx="430" cy="470" r="3" fill="#0f172a" />
            <text x="485" y="444" fontSize="9" fontWeight="bold" fill="#0f172a">
              SPEC: {concept.materials[0]?.material || 'Natural Stone Flooring'}
            </text>

            {/* Dimension Strings (Vertical on Right) */}
            <g>
              <line x1="910" y1="160" x2="910" y2="470" stroke="#0f172a" strokeWidth="1" />
              <line x1="905" y1="160" x2="915" y2="160" stroke="#0f172a" strokeWidth="1" />
              <line x1="905" y1="470" x2="915" y2="470" stroke="#0f172a" strokeWidth="1" />
              <text x="925" y="315" fontSize="11" fontWeight="bold" fill="#0f172a">
                2,950 mm CLEAR
              </text>
            </g>

            {/* Architectural Title Block */}
            <g transform="translate(25, 575)">
              <rect x="0" y="0" width="1050" height="75" fill="#f8fafc" stroke="#0f172a" strokeWidth="1" />
              <line x1="220" y1="0" x2="220" y2="75" stroke="#0f172a" strokeWidth="0.8" />
              <line x1="560" y1="0" x2="560" y2="75" stroke="#0f172a" strokeWidth="0.8" />
              <line x1="820" y1="0" x2="820" y2="75" stroke="#0f172a" strokeWidth="0.8" />

              {/* Col 1 */}
              <text x="15" y="24" fontSize="12" fontWeight="bold" fill="#0f172a">
                ARCHCRM ARCHITECTURAL GROUP
              </text>
              <text x="15" y="42" fontSize="9" fill="#64748b">
                GFC Structural Section &amp; Clearance Protocol
              </text>
              <text x="15" y="58" fontSize="8" fill="#64748b">
                Approved Baseline • Drawing Series A-200
              </text>

              {/* Col 2 */}
              <text x="235" y="20" fontSize="9" fontWeight="bold" fill="#64748b">
                PROJECT &amp; CLIENT INFORMATION
              </text>
              <text x="235" y="38" fontSize="13" fontWeight="bold" fill="#0f172a">
                {clientName}
              </text>
              <text x="235" y="54" fontSize="9" fill="#64748b">
                Total Area: {builtUpAreaSqFt.toLocaleString()} sq.ft • Style: {concept.themeStyle}
              </text>

              {/* Col 3 */}
              <text x="575" y="20" fontSize="9" fontWeight="bold" fill="#64748b">
                DRAWING SHEET TITLE
              </text>
              <text x="575" y="38" fontSize="12" fontWeight="bold" fill="#0f172a">
                LONGITUDINAL TECHNICAL SECTION &amp; CEILING DATUM
              </text>
              <text x="575" y="54" fontSize="10" fill="#059669" fontWeight="bold">
                STATUS: APPROVED FOR GFC COORDINATION
              </text>

              {/* Col 4 */}
              <text x="835" y="22" fontSize="14" fontWeight="bold" fill="#0f172a">
                SHEET: {drawingNumber}
              </text>
              <text x="835" y="40" fontSize="10" fill="#64748b">
                SCALE: {scale} • SIZE: ISO A3
              </text>
              <text x="835" y="54" fontSize="10" fill="#64748b">
                REVISION: {revision} • DATE: {sheetDate}
              </text>
            </g>
          </svg>
        </div>
      ) : (
        /* High-Res Technical Section Image View */
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-md relative group">
          <div
            className="relative w-full aspect-16/9 bg-slate-900 overflow-hidden cursor-pointer"
            onClick={onOpenLightbox}
          >
            <img
              src={asset?.imageUrl || '/cad_section_drawing.jpg'}
              alt={asset?.title || 'Section & Elevation'}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

            <div className="absolute top-3 left-3 flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono bg-black/70 text-emerald-300 border border-emerald-500/30 backdrop-blur-md">
                Section Drawing Print
              </span>
              <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-black/60 text-slate-300 backdrop-blur-md border border-white/10">
                {drawingNumber} • {scale}
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
              <div className="max-w-2xl bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {asset?.title || 'Architectural Section & Elevation Sheet'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                  {asset?.subtitle || 'Vertical datum benchmarks, structural slab clearances, and ceiling plenum detailing'}
                </p>
              </div>

              <span className="text-[11px] font-semibold text-amber-300 bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-md border border-amber-500/30">
                Click to Enlarge
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
