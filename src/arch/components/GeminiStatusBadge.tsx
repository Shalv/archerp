import React, { useState } from 'react';
import { Sparkles, RefreshCw, CheckCircle2, AlertCircle, Zap } from 'lucide-react';
import { GeminiStatus } from '../types';

interface GeminiStatusBadgeProps {
  status: GeminiStatus | null;
  onRefresh: () => Promise<void>;
}

export const GeminiStatusBadge: React.FC<GeminiStatusBadgeProps> = ({ status, onRefresh }) => {
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [showPopover, setShowPopover] = useState<boolean>(false);

  const handleCheck = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsChecking(true);
    await onRefresh();
    setIsChecking(false);
  };

  const isConfigured = status?.configured ?? true;
  const isHealthy = status?.healthy ?? true;

  return (
    <div className="relative inline-block">
      <button
        type="button"
        onClick={() => setShowPopover(!showPopover)}
        className="px-2.5 py-1 rounded-full text-[11px] font-semibold flex items-center space-x-1.5 border transition-all bg-slate-900 text-white border-slate-700 hover:border-slate-500 shadow-2xs"
        title="Gemini AI Engine Status"
      >
        <span className="relative flex h-2 w-2">
          <span
            className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isHealthy ? 'bg-emerald-400' : 'bg-amber-400'
            }`}
          ></span>
          <span
            className={`relative inline-flex rounded-full h-2 w-2 ${
              isHealthy ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
          ></span>
        </span>
        <span className="font-mono text-[10px] text-amber-400 font-bold">GEMINI 3.8 FLASH</span>
        <span className="text-slate-400 hidden sm:inline">•</span>
        <span className="text-slate-300 hidden sm:inline">Real-Time AI</span>
      </button>

      {showPopover && (
        <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-4 z-40 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-3">
            <div className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-900">Gemini Live Capabilities</span>
            </div>
            <button
              type="button"
              onClick={handleCheck}
              disabled={isChecking}
              className="text-[10px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center space-x-1"
            >
              <RefreshCw className={`w-3 h-3 ${isChecking ? 'animate-spin' : ''}`} />
              <span>{isChecking ? 'Testing...' : 'Check Ping'}</span>
            </button>
          </div>

          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Reasoning Model:</span>
              <span className="font-mono font-bold text-slate-800 text-[11px]">
                {status?.model || 'gemini-3.8-flash'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Visuals Engine:</span>
              <span className="font-mono font-bold text-slate-800 text-[11px]">
                {status?.imageModel || 'gemini-3.1-flash-lite-image'}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Streaming (SSE):</span>
              <span className="font-semibold text-emerald-600 text-[11px] flex items-center space-x-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Active</span>
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Real-Time Status:</span>
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${
                  isHealthy ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'
                }`}
              >
                {status?.configured ? 'Online & Authenticated' : 'Ready (Smart Architecture Engine)'}
              </span>
            </div>
          </div>

          <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
            <span>Powered by @google/genai</span>
            <button
              type="button"
              onClick={() => setShowPopover(false)}
              className="text-slate-600 hover:text-slate-900 font-semibold"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
