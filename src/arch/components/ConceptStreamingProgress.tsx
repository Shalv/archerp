import React from 'react';
import { Sparkles, Cpu, Layers, RefreshCw, CheckCircle2 } from 'lucide-react';
import { GenerationProgress } from '../types';

interface ConceptStreamingProgressProps {
  progress: GenerationProgress | null;
  isGenerating: boolean;
}

const STEPS = [
  { step: 1, label: 'Brief & Site Constraints', code: 'brief_analysis' },
  { step: 2, label: 'Gemini 3.8 Flash Spatial Logic', code: 'gemini_synthesis' },
  { step: 3, label: 'Material & Cost Schedule', code: 'material_costing' },
  { step: 4, label: 'Visual Sheets & Schematics', code: 'visual_orchestration' },
];

export const ConceptStreamingProgress: React.FC<ConceptStreamingProgressProps> = ({
  progress,
  isGenerating,
}) => {
  if (!isGenerating && !progress) return null;

  const currentStep = progress?.step || 1;
  const totalSteps = progress?.totalSteps || 4;
  const percent = Math.min(100, Math.round((currentStep / totalSteps) * 100));

  return (
    <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-2xl p-5 border border-indigo-800/40 shadow-lg space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/30 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5 text-amber-400 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                Real-Time Gemini 3.8 Flash Engine
              </span>
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping mr-1.5"></span>
                Streaming SSE Active
              </span>
            </div>
            <h3 className="text-sm font-bold text-white mt-0.5">
              {progress?.message || 'Synthesizing 5 distinct architectural options in real time...'}
            </h3>
          </div>
        </div>

        <div className="flex items-center space-x-2 self-start sm:self-auto">
          <span className="text-xs font-mono text-slate-300">
            Step {currentStep} of {totalSteps}
          </span>
          <span className="text-sm font-bold text-amber-400 font-mono">
            {percent}%
          </span>
        </div>
      </div>

      {/* Progress Track */}
      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
        <div
          className="bg-gradient-to-r from-amber-400 via-indigo-400 to-emerald-400 h-2 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percent}%` }}
        />
      </div>

      {/* Steps visualization */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 pt-1">
        {STEPS.map((s) => {
          const isDone = currentStep > s.step;
          const isCurrent = currentStep === s.step;
          return (
            <div
              key={s.step}
              className={`p-2 rounded-xl border text-[11px] transition-colors flex items-center space-x-2 ${
                isCurrent
                  ? 'bg-indigo-900/40 border-amber-400/60 text-white font-medium shadow-xs'
                  : isDone
                  ? 'bg-slate-900/60 border-emerald-500/40 text-slate-200'
                  : 'bg-slate-900/30 border-slate-800 text-slate-400'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <RefreshCw className="w-3.5 h-3.5 text-amber-400 animate-spin shrink-0" />
              ) : (
                <div className="w-3.5 h-3.5 rounded-full border border-slate-600 flex items-center justify-center text-[9px] font-mono shrink-0">
                  {s.step}
                </div>
              )}
              <span className="truncate">{s.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
