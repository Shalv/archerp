import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  Camera,
  Layers,
  Ruler,
  Palette,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
  Sliders,
  Server,
  Cpu,
  Zap,
  Terminal,
  Check,
  Globe,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { ArchitecturalVisualAsset, ConceptOption, ProjectCustomer } from '../types';

interface GeminiAssetGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  concept: ConceptOption;
  project: ProjectCustomer;
  initialSheetType?: ArchitecturalVisualAsset['type'];
  onSuccess?: (imageUrl: string, source: string) => void;
}

const SHEET_TYPE_OPTIONS: {
  type: ArchitecturalVisualAsset['type'];
  label: string;
  icon: any;
  defaultPromptPrefix: string;
}[] = [
  {
    type: 'render_3d',
    label: '3D Photorealistic Perspective Render',
    icon: Camera,
    defaultPromptPrefix:
      'Ultra-photorealistic 8K architectural interior perspective shot, eye-level 24mm wide lens, vertical correction, warm diffused daylighting',
  },
  {
    type: 'cad_floor_plan',
    label: 'CAD Architectural Floor Plan Drawing',
    icon: Ruler,
    defaultPromptPrefix:
      'Professional measured architectural CAD floor plan drawing, 1:100 scale, crisp black line-weights, room zoning tags, furniture layout and structural dimensions',
  },
  {
    type: 'elevation_section',
    label: 'Section & Elevation Detail Drawing',
    icon: Layers,
    defaultPromptPrefix:
      'Technical architectural longitudinal section and elevation detail, showing floor-to-ceiling heights, clerestory daylight penetration, structural slab build-up and MEP plenum',
  },
  {
    type: 'material_moodboard',
    label: 'Material Swatches & Finishes Moodboard',
    icon: Palette,
    defaultPromptPrefix:
      'Curated physical architectural tactile material flatlay board with tactile textures, eco-specifications, finishes swatches, and lighting samples',
  },
  {
    type: 'client_reference',
    label: 'Client Sample & Architectural Reference',
    icon: Paperclip,
    defaultPromptPrefix:
      'High-resolution architectural contextual photograph and spatial benchmark matching client brief and design constraints',
  },
];

const OLLAMA_MODEL_PRESETS = [
  {
    id: 'x/z-image-turbo',
    name: 'x/z-image-turbo',
    label: 'Alibaba Tongyi Z-Image Turbo (8K Photorealistic, Recommended)',
    tag: 'Recommended',
  },
  {
    id: 'x/flux2-klein',
    name: 'x/flux2-klein',
    label: 'Black Forest Labs Flux.2 Klein (Fast & Compact)',
    tag: 'Fast',
  },
  {
    id: 'flux',
    name: 'flux',
    label: 'Flux Standard Image Model',
    tag: 'High Fidelity',
  },
];

export const GeminiAssetGeneratorModal: React.FC<GeminiAssetGeneratorModalProps> = ({
  isOpen,
  onClose,
  concept,
  project,
  initialSheetType = 'render_3d',
  onSuccess,
}) => {
  const { generateGeminiImageForAsset } = useProject();

  // Ollama Configuration State
  const [ollamaHost, setOllamaHost] = useState<string>('http://localhost:11434');
  const [ollamaModel, setOllamaModel] = useState<string>('x/z-image-turbo');
  const [customOllamaModel, setCustomOllamaModel] = useState<string>('');
  const [isCheckingOllama, setIsCheckingOllama] = useState<boolean>(false);
  const [ollamaStatus, setOllamaStatus] = useState<{
    checked: boolean;
    connected: boolean;
    version?: string;
    models?: Array<{ name: string }>;
    error?: string;
  }>({ checked: false, connected: false });

  const [sheetType, setSheetType] = useState<ArchitecturalVisualAsset['type']>(initialSheetType);
  const [styleTheme, setStyleTheme] = useState<string>(concept.themeStyle);
  const [spaceFocus, setSpaceFocus] = useState<string>(
    project.confirmedRequirements?.projectVision || 'Central living forum with daylighting lightwell'
  );
  const [lightingAtmosphere, setLightingAtmosphere] = useState<string>('Warm golden hour daylight with soft shadows');
  const [materialHighlights, setMaterialHighlights] = useState<string>(
    concept.materials?.map((m) => m.material).join(', ') || 'Engineered oak, lime plaster, brushed gunmetal'
  );
  const [customPromptText, setCustomPromptText] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error' | 'info'; text: string } | null>(null);

  useEffect(() => {
    if (initialSheetType) {
      setSheetType(initialSheetType);
    }
  }, [initialSheetType]);

  // Check Ollama status when modal opens or host changes
  const checkOllama = async (hostToCheck = ollamaHost) => {
    setIsCheckingOllama(true);
    try {
      const res = await fetch('/api/ollama/status', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ host: hostToCheck }),
      });
      const data = await res.json();
      setOllamaStatus({
        checked: true,
        connected: Boolean(data.connected),
        version: data.version,
        models: data.models || [],
        error: data.error,
      });
    } catch (err: any) {
      setOllamaStatus({
        checked: true,
        connected: false,
        error: err?.message || 'Failed to ping Ollama daemon',
      });
    } finally {
      setIsCheckingOllama(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      checkOllama();
    }
  }, [isOpen]);

  // Compute composite synthesized prompt based on user inputs
  useEffect(() => {
    const sheetMeta = SHEET_TYPE_OPTIONS.find((s) => s.type === sheetType);
    const prefix = sheetMeta?.defaultPromptPrefix || 'Architectural visualization';
    const composite = `${prefix} for ${project.clientName} Residence. Style: ${styleTheme}. Spatial Zone: ${spaceFocus}. Materials: ${materialHighlights}. Atmosphere: ${lightingAtmosphere}. Built-up Area: ${project.builtUpAreaSqFt} sq.ft. Strictly professional architectural deliverable.`;
    setCustomPromptText(composite);
  }, [sheetType, styleTheme, spaceFocus, lightingAtmosphere, materialHighlights, project]);

  if (!isOpen) return null;

  const activeModel = customOllamaModel.trim() || ollamaModel;

  const handleGenerate = async () => {
    setIsGenerating(true);
    setStatusMessage({
      type: 'info',
      text: `Synthesizing architectural asset with Ollama (${activeModel})...`,
    });

    try {
      const result = await generateGeminiImageForAsset(
        project.id,
        concept.id,
        sheetType,
        customPromptText,
        styleTheme,
        {
          provider: 'ollama',
          ollamaHost,
          ollamaModel: activeModel,
        }
      );

      if (result.success && result.imageUrl) {
        const sourceNotice = result.source || `Ollama (${activeModel})`;
        const fallbackText = result.ollamaError
          ? ` (Note: Ollama daemon was offline or returned error; reference asset displayed)`
          : '';

        setStatusMessage({
          type: 'success',
          text: `Asset synthesized via ${sourceNotice}!${fallbackText}`,
        });

        if (onSuccess) {
          onSuccess(result.imageUrl, result.source || `Ollama (${activeModel})`);
        }
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setStatusMessage({
          type: 'error',
          text: result.error || 'Failed to synthesize asset. Please check Ollama host connection or model name.',
        });
      }
    } catch (err: any) {
      setStatusMessage({
        type: 'error',
        text: err?.message || 'Unexpected error during asset generation.',
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const presetStyleTags = [
    'Warm Biophilic & Japandi',
    'Minimalist Monolithic Basalt',
    'Refined Industrial Steel & Crittall',
    'Neo-Classical French Parquet',
    'Sustainable Passive Modernism',
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/20 text-indigo-300 border border-indigo-400/30">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-mono font-bold text-indigo-400 tracking-wider">
                  AI Visual Studio &bull; Ollama Engine
                </span>
                <span className="text-slate-500">&bull;</span>
                <span className="text-xs text-slate-300">Option {concept.optionNumber}</span>
              </div>
              <h2 className="text-base font-bold text-white tracking-tight">
                Architectural Drawing &amp; Render Synthesizer
              </h2>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-700">
          {/* Ollama Engine Configuration */}
          <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 space-y-2.5">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
                <Cpu className="w-3.5 h-3.5 text-indigo-600" />
                <span>Ollama AI Configuration</span>
              </label>
              <span className="text-[10px] text-slate-500 font-medium">Local Open-Source Synthesis</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* Ollama Host Address */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-[11px] font-semibold text-slate-700 flex items-center space-x-1">
                    <Globe className="w-3 h-3 text-slate-400" />
                    <span>Ollama Daemon URL</span>
                  </label>
                  <button
                    type="button"
                    onClick={() => checkOllama(ollamaHost)}
                    disabled={isCheckingOllama}
                    className="text-[10px] text-indigo-600 hover:text-indigo-800 font-medium flex items-center space-x-1"
                  >
                    <RefreshCw className={`w-2.5 h-2.5 ${isCheckingOllama ? 'animate-spin' : ''}`} />
                    <span>{isCheckingOllama ? 'Testing...' : 'Test Connection'}</span>
                  </button>
                </div>
                <input
                  type="text"
                  value={ollamaHost}
                  onChange={(e) => setOllamaHost(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                  placeholder="http://localhost:11434"
                />
              </div>

              {/* Ollama Model Selector */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Ollama Image Generation Model
                </label>
                <select
                  value={ollamaModel}
                  onChange={(e) => {
                    setOllamaModel(e.target.value);
                    setCustomOllamaModel('');
                  }}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden bg-white"
                >
                  {OLLAMA_MODEL_PRESETS.map((m) => (
                    <option key={m.id} value={m.id}>
                      {m.label}
                    </option>
                  ))}
                  <option value="custom">-- Custom Ollama Model --</option>
                </select>
              </div>
            </div>

            {/* Custom Model Input if selected */}
            {ollamaModel === 'custom' && (
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Specify Custom Ollama Model Name
                </label>
                <input
                  type="text"
                  value={customOllamaModel}
                  onChange={(e) => setCustomOllamaModel(e.target.value)}
                  placeholder="e.g. x/z-image-turbo or my-fine-tuned-diffusion"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-mono focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>
            )}

            {/* Connection Status Banner & Terminal Helper */}
            <div className="flex items-center justify-between px-2.5 py-2 rounded-lg bg-white border border-slate-200">
              <div className="flex items-center space-x-2">
                <span
                  className={`w-2 h-2 rounded-full ${
                    ollamaStatus.connected ? 'bg-emerald-500 animate-pulse' : 'bg-amber-400'
                  }`}
                />
                <span className="text-[11px] font-medium text-slate-700">
                  {ollamaStatus.connected ? (
                    <>
                      Connected to Ollama {ollamaStatus.version && `(${ollamaStatus.version})`} &bull; Ready to generate
                    </>
                  ) : (
                    <>Ollama daemon status: {ollamaStatus.checked ? 'Not detected locally' : 'Ready to verify'}</>
                  )}
                </span>
              </div>

              <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                <Terminal className="w-3 h-3 text-slate-400" />
                <code className="bg-slate-100 px-1.5 py-0.5 rounded font-mono text-[10px]">
                  ollama run {activeModel}
                </code>
              </div>
            </div>
          </div>

          {/* Target Sheet Type Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-2">
              Select Deliverable Sheet Type
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {SHEET_TYPE_OPTIONS.map((item) => {
                const isSelected = sheetType === item.type;
                const Icon = item.icon;
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setSheetType(item.type)}
                    className={`p-2.5 rounded-xl border text-left transition-all flex items-center space-x-2 ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 text-indigo-950 font-bold shadow-2xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                    <span className="text-xs truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Quick Style Selector */}
          <div>
            <label className="block text-[11px] font-bold uppercase text-slate-500 tracking-wider mb-1.5">
              Architectural Style / Theme Preset
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2">
              {presetStyleTags.map((tag) => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => setStyleTheme(tag)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                    styleTheme === tag
                      ? 'bg-slate-900 text-white font-bold'
                      : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={styleTheme}
              onChange={(e) => setStyleTheme(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              placeholder="E.g. Warm Biophilic &amp; Japandi Harmony"
            />
          </div>

          {/* Detailed Input Directives Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Spatial Zone / Specific View Focus
              </label>
              <input
                type="text"
                value={spaceFocus}
                onChange={(e) => setSpaceFocus(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                placeholder="E.g. Central Lightwell with Living Oak Slats"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Lighting &amp; Atmosphere Directives
              </label>
              <input
                type="text"
                value={lightingAtmosphere}
                onChange={(e) => setLightingAtmosphere(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                placeholder="E.g. Crisp diffused natural daylight 5000K"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-700 mb-1">
              Material &amp; Texture Specifications
            </label>
            <input
              type="text"
              value={materialHighlights}
              onChange={(e) => setMaterialHighlights(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
              placeholder="E.g. Wide plank engineered timber, lime plaster, gunmetal fixtures"
            />
          </div>

          {/* Synthesized Prompt Preview / Override */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-[11px] font-bold uppercase text-slate-500 tracking-wider">
                Synthesized Prompt Sent to Ollama AI
              </label>
              <span className="text-[10px] text-slate-400">Editable Directive</span>
            </div>
            <textarea
              rows={3}
              value={customPromptText}
              onChange={(e) => setCustomPromptText(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-mono text-slate-800 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
            />
          </div>

          {/* Status Feedback */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border flex items-center space-x-2 text-xs ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : statusMessage.type === 'error'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-indigo-50 border-indigo-200 text-indigo-800'
              }`}
            >
              {statusMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
              {statusMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
              {statusMessage.type === 'info' && <RefreshCw className="w-4 h-4 text-indigo-600 animate-spin shrink-0" />}
              <span>{statusMessage.text}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between">
          <div className="text-[11px] text-slate-500 flex items-center space-x-1">
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Target: {project.builtUpAreaSqFt.toLocaleString()} sq.ft &bull; {project.clientName}</span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-2 text-xs font-semibold rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-700 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isGenerating || !customPromptText.trim()}
              onClick={handleGenerate}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs flex items-center space-x-2"
            >
              {isGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-indigo-400" />
                  <span>Synthesizing with Ollama ({activeModel})...</span>
                </>
              ) : (
                <>
                  <Server className="w-4 h-4 text-indigo-400" />
                  <span>Generate with Ollama ({activeModel})</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const OllamaAssetGeneratorModal = GeminiAssetGeneratorModal;

