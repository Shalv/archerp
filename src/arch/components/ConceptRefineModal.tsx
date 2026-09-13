import React, { useState } from 'react';
import {
  Sparkles,
  X,
  RefreshCw,
  Sliders,
  CheckCircle2,
  AlertCircle,
  Wand2,
  Leaf,
  DollarSign,
  Maximize2,
  Sun,
  VolumeX,
} from 'lucide-react';
import { ConceptOption } from '../types';

interface ConceptRefineModalProps {
  isOpen: boolean;
  onClose: () => void;
  concept: ConceptOption;
  clientName: string;
  onRefine: (instruction: string) => Promise<{ success: boolean; error?: string }>;
}

const PRESET_PROMPTS = [
  {
    icon: Sun,
    label: 'Maximize Daylighting & Passive Shading',
    prompt: 'Enhance spatial orientation to maximize natural morning daylight penetration, incorporate deep architectural overhangs, and optimize solar heat gain reduction.',
  },
  {
    icon: DollarSign,
    label: 'Value Engineer Cost by ~10%',
    prompt: 'Value-engineer material finishes to reduce estimated square foot cost by approximately 10% while strictly preserving spatial elegance and structural aesthetics.',
  },
  {
    icon: Leaf,
    label: 'Boost Sustainability to 95+',
    prompt: 'Upgrade material specifications to 100% FSC-certified timber, low-VOC breathable mineral plasters, recycled brass, and target net-zero thermal efficiency.',
  },
  {
    icon: VolumeX,
    label: 'Acoustic Isolation & Private Sanctum',
    prompt: 'Incorporate acoustic wall buffers, sound-dampened timber slat ceilings, and isolate private sleeping quarters from the social entertaining zone.',
  },
  {
    icon: Maximize2,
    label: 'Open-Plan Atrium & High Ceilings',
    prompt: 'Reconfigure spatial zoning for a dramatic double-height atrium living zone with fluid sightlines and seamless indoor-outdoor transition.',
  },
];

export const ConceptRefineModal: React.FC<ConceptRefineModalProps> = ({
  isOpen,
  onClose,
  concept,
  clientName,
  onRefine,
}) => {
  const [instruction, setInstruction] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instruction.trim() || isSubmitting) return;

    setIsSubmitting(true);
    setStatusMessage(null);

    const result = await onRefine(instruction.trim());
    setIsSubmitting(false);

    if (result.success) {
      setStatusMessage({
        type: 'success',
        text: `Option ${concept.optionNumber} refined in real time with Gemini 3.8 Flash!`,
      });
      setTimeout(() => {
        onClose();
        setStatusMessage(null);
      }, 1500);
    } else {
      setStatusMessage({
        type: 'error',
        text: result.error || 'Failed to refine concept. Please check network connection.',
      });
    }
  };

  const handleApplyPreset = (prompt: string) => {
    setInstruction(prompt);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
              <Wand2 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                  Gemini 3.8 Flash
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-200">Real-Time Refinement</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                Refine Option {concept.optionNumber}: {concept.themeStyle}
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

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 overflow-y-auto">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Architectural Refinement Directive
            </label>
            <p className="text-xs text-slate-500 mb-2.5">
              Instruct Gemini to adjust spatial zoning percentages, trade materials, eco-specifications, or budget parameters for {clientName}.
            </p>
            <textarea
              rows={4}
              value={instruction}
              onChange={(e) => setInstruction(e.target.value)}
              placeholder="e.g. Value-engineer the flooring to engineered bamboo, increase the natural light penetration in the dining wing, and target an estimated rate below $110/sq.ft..."
              className="w-full text-xs p-3.5 rounded-xl border border-slate-300 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 outline-none transition-all placeholder:text-slate-400 bg-slate-50/50 leading-relaxed font-sans"
              required
            />
          </div>

          {/* Preset Chips */}
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Quick Architectural Modification Directives
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {PRESET_PROMPTS.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleApplyPreset(item.prompt)}
                    className="p-2.5 text-left rounded-xl border border-slate-200 hover:border-indigo-400 hover:bg-indigo-50/40 text-xs transition-colors group flex items-start space-x-2"
                  >
                    <Icon className="w-4 h-4 text-indigo-600 group-hover:text-indigo-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block text-xs group-hover:text-indigo-900">
                        {item.label}
                      </span>
                      <span className="text-[10px] text-slate-500 line-clamp-1">
                        {item.prompt}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Status Message */}
          {statusMessage && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center space-x-2 ${
                statusMessage.type === 'success'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                  : 'bg-rose-50 border-rose-300 text-rose-800'
              }`}
            >
              {statusMessage.type === 'success' ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              )}
              <span>{statusMessage.text}</span>
            </div>
          )}

          {/* Footer controls */}
          <div className="pt-3 border-t border-slate-200 flex items-center justify-between">
            <div className="flex items-center space-x-1 text-[11px] text-slate-500 font-mono">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Real-Time Model: gemini-3.8-flash</span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !instruction.trim()}
                className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin text-amber-400" />
                    <span>Synthesizing with Gemini...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Apply Real-Time AI Refinement</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
