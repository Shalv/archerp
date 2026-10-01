import React, { useState } from 'react';
import { X, Download, ZoomIn, Sparkles, RefreshCw, Layers, ShieldCheck, CheckCircle2, Camera, Check } from 'lucide-react';
import { VisualConceptVersion, ExtractedRoomGeometry, FurnitureLayoutOption, FloorPlanReferenceImage } from '../../types/floorplanSpatial';
import { VILLA_253_ALL_REFERENCE_IMAGES } from '../../data/villa253ReferenceImages';

interface VisualConceptLightboxModalProps {
  concept: VisualConceptVersion;
  room: ExtractedRoomGeometry;
  layout?: FurnitureLayoutOption;
  onClose: () => void;
  onRegenerateConcept?: () => void;
  isRegenerating?: boolean;
  onApplyReferenceImage?: (image: FloorPlanReferenceImage) => void;
}

export const VisualConceptLightboxModal: React.FC<VisualConceptLightboxModalProps> = ({
  concept,
  room,
  layout,
  onClose,
  onRegenerateConcept,
  isRegenerating = false,
  onApplyReferenceImage
}) => {
  const handleDownloadImage = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[95vh] flex flex-col shadow-2xl overflow-hidden text-white">
        {/* Header Bar */}
        <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/70">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-900/60 text-purple-300 border border-purple-500/40">
                {concept.conceptVersionCode}
              </span>
              <span className="text-xs text-slate-400 font-semibold">
                {room.name} • {room.lengthFt}' × {room.widthFt}' ({room.carpetAreaSqFt} sq.ft)
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-900/60 text-emerald-300 border border-emerald-500/40 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3 text-emerald-400" />
                <span>Dimensions Locked</span>
              </span>
            </div>
            <h2 className="text-base font-bold text-white mt-0.5 truncate max-w-2xl">
              {concept.styleTheme}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            {onRegenerateConcept && (
              <button
                type="button"
                onClick={onRegenerateConcept}
                disabled={isRegenerating}
                className="px-3 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-bold transition flex items-center gap-1.5 shadow-xs border border-purple-400/40 cursor-pointer disabled:opacity-50"
                title="Regenerate an alternative AI photorealistic visual concept and material theme"
              >
                <RefreshCw className={`w-3.5 h-3.5 text-amber-300 ${isRegenerating ? 'animate-spin' : ''}`} />
                <span>{isRegenerating ? 'Generating AI Concept...' : 'Regenerate Option with AI'}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => handleDownloadImage(concept.renderImageUrl, `${concept.conceptVersionCode}_render.jpg`)}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1.5 border border-slate-700 cursor-pointer"
              title="Download high-resolution 3D visual concept render"
            >
              <Download className="w-3.5 h-3.5 text-slate-300" />
              <span>Download Render</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700"
              title="Close expanded view (Esc)"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Body: Large Expanded Dual Comparison */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Expanded 3D Visual Concept View (7 Cols) */}
            <div className="lg:col-span-7 space-y-2">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video group shadow-lg">
                <img
                  src={concept.renderImageUrl}
                  alt={concept.styleTheme}
                  className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-amber-300 text-xs font-mono font-bold border border-amber-400/30 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>3D PHOTOREALISTIC CONCEPT RENDER</span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <button
                    type="button"
                    onClick={() => handleDownloadImage(concept.renderImageUrl, `${concept.conceptVersionCode}_render.jpg`)}
                    className="px-3 py-1.5 rounded bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save Image</span>
                  </button>
                </div>
              </div>

              {/* Design Rationale */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-300 leading-relaxed">
                <strong className="text-white block mb-1">Architectural Design Rationale:</strong>
                {concept.designRationale}
              </div>
            </div>

            {/* Side-by-Side Measured 2D Layout Plan (5 Cols) */}
            <div className="lg:col-span-5 space-y-2 flex flex-col">
              <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-slate-950 aspect-video group shadow-lg">
                <img
                  src={concept.verified2DLayoutUrl}
                  alt="Verified 2D CAD Plan"
                  className="w-full h-full object-cover opacity-95 hover:opacity-100 transition"
                />
                <div className="absolute top-3 left-3 px-2.5 py-1 rounded bg-black/70 backdrop-blur-md text-emerald-300 text-xs font-mono font-bold border border-emerald-400/30 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-400" />
                  <span>VERIFIED 2D ARCHITECTURAL CAD</span>
                </div>
                <div className="absolute bottom-3 right-3">
                  <button
                    type="button"
                    onClick={() => handleDownloadImage(concept.verified2DLayoutUrl, `${concept.conceptVersionCode}_2D_plan.jpg`)}
                    className="px-3 py-1.5 rounded bg-black/80 hover:bg-black text-white text-xs font-semibold backdrop-blur-md flex items-center gap-1.5 border border-white/20 transition cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Save 2D CAD</span>
                  </button>
                </div>
              </div>

              {/* Room Specifications & Material Summary */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2.5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-[11px] pb-2 border-b border-slate-800">
                    <span className="text-slate-400">Allocated Budget:</span>
                    <strong className="text-emerald-400 font-mono">₹{concept.budgetAllocated.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] py-1 border-b border-slate-800">
                    <span className="text-slate-400">Estimated Cost:</span>
                    <strong className="text-white font-mono">₹{concept.budgetActualEstimated.toLocaleString()}</strong>
                  </div>
                  <div className="flex items-center justify-between text-[11px] pt-1">
                    <span className="text-slate-400">Circulation Clearance:</span>
                    <strong className="text-sky-300 font-mono">Min 3.2ft Passage Guaranteed</strong>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold block mb-1.5">
                    Palette &amp; Selected Material Finishes:
                  </span>
                  <div className="flex items-center gap-1.5 mb-2">
                    {concept.colorPalette?.map((hex, i) => (
                      <span
                        key={i}
                        style={{ backgroundColor: hex }}
                        className="w-5 h-5 rounded-full border border-slate-600 inline-block shadow-xs"
                        title={hex}
                      />
                    ))}
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1 divide-y divide-slate-800/80 pr-1 text-[11px]">
                    {concept.materials.map((m, idx) => (
                      <div key={idx} className="pt-1 flex items-center justify-between text-slate-300">
                        <span className="truncate max-w-[200px]">{m.trade}: {m.item}</span>
                        <span className="font-mono text-emerald-400 font-semibold shrink-0">₹{m.totalCost.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reference Images Quick Selector Strip */}
          <div className="pt-3 border-t border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-amber-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Camera className="w-3.5 h-3.5 text-amber-400" />
                <span>Reference Images Applied to This Floor Plan (Click to Switch View):</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {VILLA_253_ALL_REFERENCE_IMAGES.length} Project References Available
              </span>
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-thin">
              {VILLA_253_ALL_REFERENCE_IMAGES.map((refImg) => {
                const isActive = concept.renderImageUrl === refImg.imageUrl;
                return (
                  <button
                    key={refImg.id}
                    type="button"
                    onClick={() => onApplyReferenceImage?.(refImg)}
                    className={`shrink-0 w-44 rounded-xl border text-left overflow-hidden transition-all duration-150 group cursor-pointer bg-slate-950 ${
                      isActive 
                        ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg' 
                        : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                    }`}
                  >
                    <div className="relative aspect-video bg-black overflow-hidden">
                      <img
                        src={refImg.imageUrl}
                        alt={refImg.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      />
                      {isActive && (
                        <div className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-600/90 text-white text-[9px] font-mono font-bold flex items-center gap-1">
                          <Check className="w-2.5 h-2.5" />
                          <span>ACTIVE</span>
                        </div>
                      )}
                      {refImg.cameraHotspot && (
                        <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/80 text-amber-300 text-[8px] font-mono">
                          {refImg.cameraHotspot.cameraLabel.split(' ')[0]}
                        </div>
                      )}
                    </div>
                    <div className="p-2">
                      <div className="text-[10px] font-bold text-white truncate group-hover:text-amber-300">
                        {refImg.title}
                      </div>
                      <div className="text-[9px] text-slate-400 truncate mt-0.5">
                        {refImg.category.replace(/_/g, ' ')}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

