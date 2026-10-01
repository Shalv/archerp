import React, { useState } from 'react';
import {
  Layers,
  Download,
  FileText,
  FileCode2,
  Check,
  Eye,
  Compass,
  Info,
  Maximize2
} from 'lucide-react';
import {
  CadLayerId,
  VILLA_253_CAD_LAYERS,
  VILLA_253_AUTHORITATIVE_SPECS,
  generateVilla253VectorCadSvg,
  triggerDownloadVilla253Dxf,
  triggerDownloadVilla253Pdf
} from '../../utils/villa253CadDataAndDxf';

interface Villa253VectorCadPreviewProps {
  roomId?: string;
  compact?: boolean;
  showLayerControls?: boolean;
  showDownloadBar?: boolean;
  onExpandClick?: () => void;
  onSelectRoom?: (roomId: string) => void;
}

export const Villa253VectorCadPreview: React.FC<Villa253VectorCadPreviewProps> = ({
  roomId = 'ROOM-V253-LIV-01',
  compact = false,
  showLayerControls = true,
  showDownloadBar = true,
  onExpandClick,
  onSelectRoom
}) => {
  const [visibleLayers, setVisibleLayers] = useState<CadLayerId[]>(
    VILLA_253_CAD_LAYERS.map(l => l.id)
  );
  const [activeSheet, setActiveSheet] = useState<'GROUND' | 'FIRST' | 'SECTION' | 'COMPOSITE'>('COMPOSITE');

  const toggleLayer = (layerId: CadLayerId) => {
    setVisibleLayers(prev =>
      prev.includes(layerId) ? prev.filter(id => id !== layerId) : [...prev, layerId]
    );
  };

  const handleDownloadDxf = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerDownloadVilla253Dxf();
  };

  const handleDownloadSvg = (e: React.MouseEvent) => {
    e.stopPropagation();
    const svgContent = generateVilla253VectorCadSvg({
      activeRoomId: roomId,
      sheet: activeSheet,
      visibleLayers
    });
    const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Villa253_FloorPlan_Vector_${roomId.toLowerCase()}_R0.svg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleDownloadSourcePdf = (e: React.MouseEvent) => {
    e.stopPropagation();
    triggerDownloadVilla253Pdf();
  };

  const svgMarkup = generateVilla253VectorCadSvg({
    activeRoomId: roomId,
    sheet: activeSheet,
    visibleLayers
  });

  const roomSpec = VILLA_253_AUTHORITATIVE_SPECS[roomId];

  if (compact) {
    return (
      <div
        onClick={onExpandClick}
        className="relative rounded-lg overflow-hidden border border-slate-700 bg-[#090D16] aspect-video group cursor-pointer flex flex-col justify-between"
        title="Click to expand Vector CAD Floor Plan & Layer Controls"
      >
        <div
          className="w-full h-full flex items-center justify-center overflow-hidden"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />

        {/* Top Badge */}
        <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-slate-950/90 backdrop-blur-sm text-emerald-300 text-[10px] font-mono font-bold border border-emerald-500/40 flex items-center gap-1 shadow">
          <Layers className="w-3 h-3 text-emerald-400" />
          <span>VECTOR CAD PLAN (R0 • 8 LAYERS)</span>
        </div>

        {/* Top Right Quick Actions */}
        <div className="absolute top-2 right-2 flex items-center gap-1">
          <button
            type="button"
            onClick={handleDownloadDxf}
            className="px-2 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-mono font-bold text-[9px] flex items-center gap-1 shadow"
            title="Download Editable AutoCAD DXF (Villa253_FloorPlan_Editable_R0.dxf)"
          >
            <Download className="w-2.5 h-2.5" />
            <span>DXF</span>
          </button>
          <button
            type="button"
            onClick={handleDownloadSourcePdf}
            className="px-2 py-1 rounded bg-sky-600 hover:bg-sky-500 text-white font-mono font-bold text-[9px] flex items-center gap-1 shadow"
            title="Download Authoritative Villa 253 Wall Marking PDF (Rev 0)"
          >
            <FileText className="w-2.5 h-2.5" />
            <span>PDF</span>
          </button>
          {onExpandClick && (
            <div className="p-1 rounded bg-slate-900/90 text-white text-[10px] border border-white/20">
              <Maximize2 className="w-3 h-3" />
            </div>
          )}
        </div>

        {/* Bottom Status Strip */}
        <div className="absolute bottom-2 left-2 right-2 px-2.5 py-1.5 rounded bg-slate-950/90 backdrop-blur-sm text-white text-[10px] flex items-center justify-between border border-slate-800">
          <span className="font-mono text-slate-300 truncate">
            {roomSpec ? `${roomSpec.shortLabel}: ${roomSpec.dimensionText}` : 'Villa 253 R0 (10-10-24)'}
          </span>
          <span className="text-emerald-400 font-mono font-bold shrink-0 ml-2">
            {roomSpec ? `${roomSpec.areaSqFt} SQ.FT VERIFIED` : '1:50 VECTOR'}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-xl text-slate-100 flex flex-col">
      {/* Top CAD Toolbar */}
      {showDownloadBar && (
        <div className="px-3.5 py-2.5 bg-slate-900/95 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-700/60 flex items-center gap-1">
              <Layers className="w-3 h-3 text-emerald-400" />
              <span>VECTOR CAD RECONSTRUCTION • REV 0 (10-10-24)</span>
            </span>
            {roomSpec && (
              <span className="text-[11px] font-mono text-amber-300 font-bold">
                Highlight: {roomSpec.shortLabel} ({roomSpec.dimensionText})
              </span>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={handleDownloadDxf}
              className="px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Open and edit in AutoCAD, DraftSight, BricsCAD, LibreCAD"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Download Editable DXF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSourcePdf}
              className="px-2.5 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold text-[11px] transition flex items-center gap-1.5 cursor-pointer shadow-xs"
              title="Download original Villa 253 Wall Marking Drawing R0 PDF"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Source PDF (R0)</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadSvg}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-[11px] border border-slate-700 transition flex items-center gap-1 cursor-pointer"
            >
              <Download className="w-3 h-3" />
              <span>SVG</span>
            </button>
          </div>
        </div>
      )}

      {/* CAD Layer Toggle Strip (8 Separate Architectural Layers) */}
      {showLayerControls && (
        <div className="px-3.5 py-2 bg-slate-900/60 border-b border-slate-800/80 flex flex-wrap items-center gap-1.5">
          <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mr-1 flex items-center gap-1">
            <Layers className="w-3 h-3 text-amber-400" />
            <span>CAD Layers ({visibleLayers.length}/8):</span>
          </span>
          {VILLA_253_CAD_LAYERS.map(layer => {
            const active = visibleLayers.includes(layer.id);
            return (
              <button
                key={layer.id}
                type="button"
                onClick={() => toggleLayer(layer.id)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono transition flex items-center gap-1 cursor-pointer border ${
                  active
                    ? 'bg-slate-800 text-white border-slate-600 shadow-2xs'
                    : 'bg-slate-950/60 text-slate-500 border-slate-800/60 hover:text-slate-300'
                }`}
                title={`${layer.dxfLayerName}: ${layer.description}`}
              >
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: active ? layer.colorHex : '#475569' }}
                />
                <span>{layer.dxfLayerName}</span>
                <span className="text-[9px] text-slate-400 hidden sm:inline">
                  ({layer.label.split(' ')[0]})
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Quick Room Jump Strip */}
      {onSelectRoom && (
        <div className="px-3.5 py-1.5 bg-slate-950 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
          <span className="text-[10px] font-mono text-slate-400 shrink-0">Highlight Zone:</span>
          {Object.values(VILLA_253_AUTHORITATIVE_SPECS).map(spec => {
            const isSelected = spec.roomId === roomId;
            return (
              <button
                key={spec.roomId}
                type="button"
                onClick={() => onSelectRoom(spec.roomId)}
                className={`shrink-0 px-2 py-0.5 rounded text-[10px] font-mono transition cursor-pointer border ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 font-bold border-amber-400'
                    : 'bg-slate-900 text-slate-300 border-slate-800 hover:bg-slate-800'
                }`}
              >
                {spec.shortLabel} ({spec.dimensionText})
              </button>
            );
          })}
        </div>
      )}

      {/* Vector SVG Viewport */}
      <div className="relative bg-[#090D16] p-2 flex items-center justify-center overflow-hidden">
        <div
          className="w-full h-auto max-h-[540px] flex items-center justify-center [&>svg]:w-full [&>svg]:h-auto [&>svg]:max-h-[520px]"
          dangerouslySetInnerHTML={{ __html: svgMarkup }}
        />
      </div>

      {/* Important CAD Authority Note */}
      <div className="px-3.5 py-2 bg-slate-900/90 border-t border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] text-slate-400">
        <div className="flex items-start sm:items-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5 sm:mt-0" />
          <span>
            <strong className="text-slate-200">CAD Note:</strong> Editable, dimension-driven DXF reconstruction from Villa 253 Wall Marking Drawing R0 (10-10-24). The original architectural PDF remains the construction authority and the DXF should be checked by the architect/CAD operator before construction use.
          </span>
        </div>
        <span className="font-mono text-emerald-400 shrink-0">
          AutoCAD / DraftSight / BricsCAD / LibreCAD Compatible
        </span>
      </div>
    </div>
  );
};
