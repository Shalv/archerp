import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  X,
  RefreshCw,
  Copy,
  Check,
  MessageSquare,
  Award,
  ShieldAlert,
  Flame,
  Clock,
} from 'lucide-react';
import { ConceptOption } from '../types';
import { formatINR } from '../utils/currency';

interface ConceptPitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  concept: ConceptOption;
  clientName: string;
  onGeneratePitch: () => Promise<{ success: boolean; error?: string }>;
}

export const ConceptPitchModal: React.FC<ConceptPitchModalProps> = ({
  isOpen,
  onClose,
  concept,
  clientName,
  onGeneratePitch,
}) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [hasCopied, setHasCopied] = useState<boolean>(false);

  const pitch = concept.aiPitchScript;

  useEffect(() => {
    if (isOpen && !pitch && !isGenerating) {
      handleGenerate();
    }
  }, [isOpen, pitch]);

  if (!isOpen) return null;

  const handleGenerate = async () => {
    setIsGenerating(true);
    await onGeneratePitch();
    setIsGenerating(false);
  };

  const handleCopy = () => {
    if (!pitch) return;
    const fullText = `ARCHITECTURAL PRESENTATION PITCH SCRIPT
Client: ${clientName}
Option: Option ${concept.optionNumber} - ${concept.themeStyle} (${concept.title})
Target Budget: ${formatINR(concept.totalEstimatedCost)} (${formatINR(concept.estimatedCostPerSqFt)}/sq.ft)

1. THE HOOK & ASPIRATIONAL OPENING:
${pitch.clientHook}

2. SPATIAL & MATERIAL NARRATIVE WALKTHROUGH:
${pitch.narrativeWalkthrough}

3. BUDGET CLARITY & CLOSING CALL TO ACTION:
${pitch.closingObjectionHandler}`;

    navigator.clipboard.writeText(fullText);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-indigo-950 to-slate-900 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
              <MessageSquare className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                  Gemini 3.8 Flash Client Presentation Script
                </span>
                <span className="text-slate-400 text-xs">•</span>
                <span className="text-xs text-slate-300">Design Principal Script</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">
                Pitch Script: Option {concept.optionNumber} for {clientName}
              </h2>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleGenerate}
              disabled={isGenerating}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold bg-white/10 hover:bg-white/20 text-white transition-colors flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isGenerating ? 'animate-spin text-amber-400' : ''}`} />
              <span>{isGenerating ? 'Synthesizing...' : 'Regenerate'}</span>
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-6">
          {isGenerating && !pitch && (
            <div className="py-16 text-center space-y-3">
              <RefreshCw className="w-8 h-8 text-amber-500 animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                Gemini 3.8 Flash is crafting an emotional, persuasive architectural pitch narrative...
              </p>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Synthesizing spatial highlights, budget value arguments, and anticipated client objection handling.
              </p>
            </div>
          )}

          {pitch && (
            <>
              {/* Concept Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs text-slate-600">
                <div>
                  <span className="font-bold text-slate-900">{concept.title}</span>
                  <span className="text-slate-400 mx-2">•</span>
                  <span>{concept.themeStyle}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="font-bold text-slate-900 font-mono">{formatINR(concept.totalEstimatedCost)}</span>
                  <span className="text-slate-400">({formatINR(concept.estimatedCostPerSqFt)}/sq.ft)</span>
                </div>
              </div>

              {/* 1. Client Hook */}
              <div className="p-4 rounded-xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300/60 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-800 font-mono flex items-center space-x-1.5">
                    <Flame className="w-3.5 h-3.5 text-amber-600" />
                    <span>Part 1: The Presentation Hook (Opening Speech)</span>
                  </span>
                  <span className="text-[10px] text-amber-700 bg-amber-100/80 px-2 py-0.5 rounded font-semibold">
                    First 60 Seconds
                  </span>
                </div>
                <p className="text-sm font-semibold text-slate-900 italic leading-relaxed">
                  &ldquo;{pitch.clientHook}&rdquo;
                </p>
              </div>

              {/* 2. Narrative Walkthrough */}
              <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-200/80 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-800 font-mono flex items-center space-x-1.5">
                    <Award className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Part 2: Room-by-Room Spatial &amp; Material Journey</span>
                  </span>
                  <span className="text-[10px] text-indigo-700 bg-indigo-100/80 px-2 py-0.5 rounded font-semibold">
                    Core Presentation
                  </span>
                </div>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">
                  {pitch.narrativeWalkthrough}
                </p>
              </div>

              {/* 3. Closing Objection Handler & Sign-off Call */}
              <div className="p-4 rounded-xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                    <span>Part 3: Budget Assurance &amp; Securing Client Sign-Off</span>
                  </span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-950/80 border border-emerald-500/30 px-2 py-0.5 rounded font-semibold">
                    The Close
                  </span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-medium">
                  &ldquo;{pitch.closingObjectionHandler}&rdquo;
                </p>
              </div>

              {pitch.timestamp && (
                <div className="flex items-center space-x-1.5 text-[11px] text-slate-400 font-mono">
                  <Clock className="w-3 h-3 text-slate-400" />
                  <span>Synthesized on {new Date(pitch.timestamp).toLocaleDateString()} via Gemini 3.8 Flash</span>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={handleCopy}
            disabled={!pitch}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 transition-colors flex items-center space-x-1.5 shadow-xs disabled:opacity-50"
          >
            {hasCopied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-bold">Script Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy Full Pitch Script</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-colors"
          >
            Close Pitch Script
          </button>
        </div>
      </div>
    </div>
  );
};
