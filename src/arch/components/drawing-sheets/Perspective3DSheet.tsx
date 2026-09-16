import React, { useState } from 'react';
import {
  Camera,
  Maximize2,
  Tag,
  Upload,
  Info,
  CheckCircle2,
  Sparkles,
  Server,
  Layers,
  Compass,
} from 'lucide-react';
import { ConceptOption, ArchitecturalVisualAsset } from '../../types';

interface Perspective3DSheetProps {
  concept: ConceptOption;
  asset?: ArchitecturalVisualAsset;
  clientName: string;
  builtUpAreaSqFt: number;
  onUploadRender?: (fileDataUrl: string, fileName: string) => void;
  onOpenLightbox?: () => void;
  onTriggerGeminiSynthesis?: () => void;
  onTriggerAiSynthesis?: () => void;
}

export const Perspective3DSheet: React.FC<Perspective3DSheetProps> = ({
  concept,
  asset,
  clientName,
  builtUpAreaSqFt,
  onUploadRender,
  onOpenLightbox,
  onTriggerGeminiSynthesis,
  onTriggerAiSynthesis,
}) => {
  const [showHotspots, setShowHotspots] = useState<boolean>(true);
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);

  const triggerSynthesis = onTriggerAiSynthesis || onTriggerGeminiSynthesis;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadRender) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUploadRender(event.target.result as string, file.name);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const annotations = asset?.annotations || [
    {
      id: 'ann-1',
      xPercent: 28,
      yPercent: 32,
      title: 'Double-Height Acoustic Slatted Ceiling',
      description: 'American White Oak acoustic slatting with sound-absorbing backing, STC-45 rating.',
      materialRef: concept.materials[0]?.material || 'Rift-cut White Oak',
    },
    {
      id: 'ann-2',
      xPercent: 72,
      yPercent: 48,
      title: 'Thermally Broken Architectural Glazing',
      description: 'Floor-to-ceiling Low-E argon insulated double-glazed curtain wall with matte black frame.',
      materialRef: 'Structural Aluminum & Low-E Glass',
    },
    {
      id: 'ann-3',
      xPercent: 45,
      yPercent: 78,
      title: 'Seamless Micro-Cement Flooring',
      description: 'Continuous polymer-modified micro-screed with ultra-matte protective sealant.',
      materialRef: concept.materials[1]?.material || 'Polished Terrazzo / Micro-cement',
    },
    {
      id: 'ann-4',
      xPercent: 15,
      yPercent: 60,
      title: 'Architectural Joinery & Integrated Storage',
      description: 'Flush handleless cabinetry concealing service pathways and audio-visual conduits.',
      materialRef: 'Architectural Veneer Millwork',
    },
  ];

  const activeHotspot = annotations.find((a) => a.id === activeHotspotId);

  return (
    <div className="space-y-3">
      {/* 3D Render Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 text-white border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Camera className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-200">
            Photorealistic 3D Perspective Render
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-300 font-mono text-[11px] font-bold">
            {concept.themeStyle}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setShowHotspots(!showHotspots)}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
              showHotspots
                ? 'bg-amber-400 text-slate-950 font-bold'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Tag className="w-3.5 h-3.5" />
            <span>{showHotspots ? 'Material Hotspots (On)' : 'Material Hotspots (Off)'}</span>
          </button>

          {triggerSynthesis && (
            <button
              type="button"
              onClick={triggerSynthesis}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-colors shadow-2xs"
              title="Synthesize 3D perspective render with Ollama Local AI"
            >
              <Server className="w-3.5 h-3.5 text-indigo-300" />
              <span>Synthesize with Ollama</span>
            </button>
          )}

          {onOpenLightbox && (
            <button
              type="button"
              onClick={onOpenLightbox}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Maximize2 className="w-3 h-3 text-amber-400" />
              <span>Fullscreen</span>
            </button>
          )}

          <label className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer transition-colors font-bold">
            <Upload className="w-3 h-3" />
            <span>Upload 3D Render</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Render Canvas Frame with Hotspot Pins */}
      <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-md relative group">
        <div className="relative w-full aspect-16/9 bg-slate-900 overflow-hidden">
          <img
            src={asset?.imageUrl || '/biophilic_concept_render.jpg'}
            alt={asset?.title || '3D Perspective Render'}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.01]"
            referrerPolicy="no-referrer"
          />

          {/* Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 flex flex-wrap items-center gap-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono bg-black/70 text-amber-300 border border-amber-500/30 backdrop-blur-md">
              3D Photorealistic Render
            </span>
            {asset?.approvalStatus === 'draft_pending_approval' && (
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold font-mono bg-amber-500 text-slate-950 shadow-md">
                Draft (Pending Approval)
              </span>
            )}
            {asset?.isCustomUpload && (
              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold font-mono bg-indigo-600/90 text-white backdrop-blur-md border border-indigo-400/40">
                Custom Upload
              </span>
            )}
            <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-black/60 text-slate-300 backdrop-blur-md border border-white/10">
              POV: Main Living &amp; Atrium View
            </span>
          </div>

          <div className="absolute top-3 right-3 flex items-center space-x-2 pointer-events-none">
            <span className="px-2.5 py-1 rounded-md text-[10px] font-mono bg-black/70 text-slate-200 border border-white/10 backdrop-blur-md">
              Sim: 15:30 Equinox Daylight • 28mm Lens
            </span>
          </div>

          {/* Interactive Material Hotspot Pins */}
          {showHotspots &&
            annotations.map((ann, idx) => {
              const isSelected = activeHotspotId === ann.id;
              return (
                <div
                  key={ann.id || idx}
                  style={{ left: `${ann.xPercent}%`, top: `${ann.yPercent}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20 group/pin"
                >
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspotId(isSelected ? null : ann.id);
                    }}
                    className={`w-6 h-6 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform hover:scale-125 focus:outline-hidden ${
                      isSelected
                        ? 'bg-amber-400 text-slate-950 ring-4 ring-amber-400/50 scale-125'
                        : 'bg-black/80 text-amber-300 border border-amber-400/80 backdrop-blur-sm'
                    }`}
                  >
                    {idx + 1}
                  </button>

                  {/* Hover Tooltip if not clicked */}
                  {!isSelected && (
                    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover/pin:block z-30 pointer-events-none whitespace-nowrap">
                      <div className="bg-slate-950/90 text-white text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-slate-700 shadow-xl backdrop-blur-md">
                        {ann.title}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

          {/* Bottom Card / Active Hotspot Inspector Card */}
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
            {activeHotspot ? (
              <div className="max-w-md bg-slate-950/90 backdrop-blur-md p-3.5 rounded-xl border border-amber-500/40 text-white shadow-xl pointer-events-auto animate-in fade-in slide-in-from-bottom-2 duration-200">
                <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
                  <div className="flex items-center space-x-1.5">
                    <span className="w-2 h-2 rounded-full bg-amber-400" />
                    <h4 className="text-xs font-bold text-amber-300">
                      {activeHotspot.title}
                    </h4>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveHotspotId(null)}
                    className="text-[10px] text-slate-400 hover:text-white"
                  >
                    Close [×]
                  </button>
                </div>
                <p className="text-xs text-slate-300 mt-1.5">
                  {'note' in activeHotspot ? activeHotspot.note : activeHotspot.description}
                </p>
                {activeHotspot.materialRef && (
                  <div className="mt-2 text-[10px] text-amber-400 font-mono bg-amber-950/40 p-1.5 rounded border border-amber-500/20">
                    MATERIAL SPEC: {activeHotspot.materialRef}
                  </div>
                )}
              </div>
            ) : (
              <div className="max-w-2xl bg-slate-950/80 backdrop-blur-md p-3.5 rounded-xl border border-white/10 pointer-events-auto">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {concept.title}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-2 leading-relaxed">
                  {concept.architecturalNarrative}
                </p>
              </div>
            )}

            {onOpenLightbox && (
              <button
                type="button"
                onClick={onOpenLightbox}
                className="px-3 py-1.5 rounded-lg bg-black/70 hover:bg-black/90 text-amber-300 border border-amber-500/30 backdrop-blur-md text-xs font-semibold shadow-md pointer-events-auto transition-colors"
              >
                Inspect Lightbox
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
