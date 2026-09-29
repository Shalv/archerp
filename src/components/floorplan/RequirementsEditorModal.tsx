import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  DollarSign, 
  Building2, 
  MapPin, 
  Plus, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  FileText,
  Upload,
  Ruler,
  Layers,
  Info
} from 'lucide-react';
import { FloorPlanCustomerInput } from '../../types/floorplanSpatial';

interface RequirementsEditorModalProps {
  currentInput: FloorPlanCustomerInput;
  mode: 'PRESET_STANDALONE' | 'CUSTOM_ADAPTIVE';
  onSave: (updatedInput: FloorPlanCustomerInput, regenerateLayouts: boolean) => void;
  onResetToStandalone: () => void;
  onClose: () => void;
}

export const RequirementsEditorModal: React.FC<RequirementsEditorModalProps> = ({
  currentInput,
  mode,
  onSave,
  onResetToStandalone,
  onClose
}) => {
  const [formData, setFormData] = useState<FloorPlanCustomerInput>({ ...currentInput });
  const [newRequirement, setNewRequirement] = useState('');
  const [regenerateLayouts, setRegenerateLayouts] = useState(true);

  // Quick Preset Handlers
  const applyPreset = (presetType: '2BHK_18L' | '3BHK_35L' | 'MINIMAL_STUDIO_10L') => {
    if (presetType === '2BHK_18L') {
      setFormData(prev => ({
        ...prev,
        propertyType: '2BHK_APARTMENT',
        totalCarpetAreaSqFt: 620,
        approximateBudget: 1800000,
        preferredStyle: 'Modern Warm Interior (Natural Teak, Warm 2700K Coves, Soft Bouclé, Fluted Panels)',
        fixedRequirements: [
          'Lots of concealed storage throughout the home without making rooms feel cramped',
          'Dedicated ergonomic work desk in the second bedroom with dual-monitor space',
          'Six-seat dining setup for weekend family dinners',
          'Zero doorway or window obstruction (strict 3.0ft minimum circulation path)',
          'Stay strictly within ₹18,00,000 total interior turnkey budget'
        ]
      }));
    } else if (presetType === '3BHK_35L') {
      setFormData(prev => ({
        ...prev,
        propertyType: '3BHK_APARTMENT',
        totalCarpetAreaSqFt: 1150,
        approximateBudget: 3500000,
        preferredStyle: 'Contemporary Luxury & Italian Marble Accents (Veneer, Brass PVD, Smart Lighting)',
        fixedRequirements: [
          'Full-length bar and wine counter in living room',
          'Dedicated walk-in wardrobe in master bedroom',
          'Executive study room with acoustic fluted paneling',
          '8-seater dining table with Italian marble top',
          'Minimum 3.5ft unobstructed corridor clearances'
        ]
      }));
    } else if (presetType === 'MINIMAL_STUDIO_10L') {
      setFormData(prev => ({
        ...prev,
        propertyType: 'STUDIO',
        totalCarpetAreaSqFt: 420,
        approximateBudget: 1000000,
        preferredStyle: 'Japandi Space-Saving Studio (Light Ash Wood, Multipurpose Murphy Bed, Neutral Tones)',
        fixedRequirements: [
          'Multifunctional hydraulic Murphy bed with integrated writing desk',
          'Maximum vertical storage up to 9.5ft false ceiling',
          'Concealed folding dining counter for 4 people',
          'Ultra-compact entryway shoe & coat organizer'
        ]
      }));
    }
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setFormData(prev => ({
        ...prev,
        fixedRequirements: [...prev.fixedRequirements, newRequirement.trim()]
      }));
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (index: number) => {
    setFormData(prev => ({
      ...prev,
      fixedRequirements: prev.fixedRequirements.filter((_, i) => i !== index)
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData, regenerateLayouts);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full border border-slate-200 shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#002050] to-[#0f6cbd] text-white p-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-white/10 border border-white/20">
              <Sliders className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base leading-tight">Configure Customer Brief &amp; Requirements</h3>
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase tracking-wider ${
                  mode === 'PRESET_STANDALONE' ? 'bg-amber-400 text-slate-900' : 'bg-emerald-400 text-slate-950'
                }`}>
                  {mode === 'PRESET_STANDALONE' ? 'Standalone Default' : 'Custom Configured'}
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Switch between standard standalone brief or customize budget, style, and room requirements for AI synthesis.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white text-sm transition cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1 text-xs">
          {/* Quick Preset Selector */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
            <span className="font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              <span>Quick Requirement Presets (One-Click Setup):</span>
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => applyPreset('2BHK_18L')}
                className="p-2 rounded-lg border border-purple-200 bg-white hover:bg-purple-50 text-left transition cursor-pointer"
              >
                <div className="font-bold text-purple-900">2BHK • ₹18 Lakh</div>
                <div className="text-[10px] text-slate-500 truncate">Modern warm, lots of storage &amp; WFH desk</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('3BHK_35L')}
                className="p-2 rounded-lg border border-blue-200 bg-white hover:bg-blue-50 text-left transition cursor-pointer"
              >
                <div className="font-bold text-blue-900">3BHK • ₹35 Lakh</div>
                <div className="text-[10px] text-slate-500 truncate">Contemporary luxury, bar &amp; marble finishes</div>
              </button>

              <button
                type="button"
                onClick={() => applyPreset('MINIMAL_STUDIO_10L')}
                className="p-2 rounded-lg border border-emerald-200 bg-white hover:bg-emerald-50 text-left transition cursor-pointer"
              >
                <div className="font-bold text-emerald-900">Studio • ₹10 Lakh</div>
                <div className="text-[10px] text-slate-500 truncate">Japandi, Murphy desk bed &amp; max storage</div>
              </button>
            </div>
          </div>

          {/* Primary Budget & Property Specs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Approximate Budget (₹ INR)
              </label>
              <div className="relative">
                <span className="absolute left-2.5 top-2 font-bold text-slate-400">₹</span>
                <input
                  type="number"
                  step="50000"
                  min="300000"
                  max="50000000"
                  value={formData.approximateBudget}
                  onChange={e => setFormData({ ...formData, approximateBudget: Number(e.target.value) })}
                  className="w-full pl-6 pr-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
                  required
                />
              </div>
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                ₹{(formData.approximateBudget / 100000).toFixed(1)} Lakhs turnkey
              </span>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Property Typology
              </label>
              <select
                value={formData.propertyType}
                onChange={e => setFormData({ ...formData, propertyType: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800 focus:ring-1 focus:ring-blue-500"
              >
                <option value="2BHK_APARTMENT">2BHK Apartment (Standard)</option>
                <option value="3BHK_APARTMENT">3BHK Luxury Apartment</option>
                <option value="4BHK_VILLA">4BHK Turnkey Villa</option>
                <option value="STUDIO">Studio Apartment (Compact)</option>
                <option value="DUPLEX">Duplex Penthouse</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Carpet Area (Sq.Ft)
              </label>
              <input
                type="number"
                min="200"
                max="10000"
                value={formData.totalCarpetAreaSqFt}
                onChange={e => setFormData({ ...formData, totalCarpetAreaSqFt: Number(e.target.value) })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-mono font-bold text-slate-900 focus:ring-1 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          {/* Preferred Interior Design Style */}
          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Preferred Interior Design Style &amp; Atmosphere
            </label>
            <input
              type="text"
              value={formData.preferredStyle}
              onChange={e => setFormData({ ...formData, preferredStyle: e.target.value })}
              placeholder="e.g. Modern Warm Interior (Natural Teak, Warm 2700K Coves, Soft Bouclé)"
              className="w-full px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-900 focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          {/* Site Location & Survey Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Site Location / Address
              </label>
              <input
                type="text"
                value={formData.siteLocation}
                onChange={e => setFormData({ ...formData, siteLocation: e.target.value })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">
                Site Survey Measurement Status
              </label>
              <select
                value={formData.siteSurveyStatus}
                onChange={e => setFormData({ ...formData, siteSurveyStatus: e.target.value as any })}
                className="w-full px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-800"
              >
                <option value="SITE_SURVEYED_VERIFIED">SITE_SURVEYED_VERIFIED (Laser verified)</option>
                <option value="PENDING_SURVEY">PENDING_SURVEY (Awaiting physical check)</option>
                <option value="NEEDS_RECHECK">NEEDS_RECHECK (Discrepancy flagged)</option>
              </select>
            </div>
          </div>

          {/* Fixed Architectural & Ergonomic Requirements List */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-800 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                <span>Fixed Functional &amp; Spatial Requirements ({formData.fixedRequirements.length}):</span>
              </label>
              <span className="text-[10px] text-slate-500">
                AI uses these constraints to lock doorway clearances and custom furniture
              </span>
            </div>

            <div className="space-y-1.5 max-h-40 overflow-y-auto divide-y divide-slate-100 border border-slate-200 rounded-lg p-2 bg-slate-50/50">
              {formData.fixedRequirements.map((req, idx) => (
                <div key={idx} className="pt-1 pb-1 flex items-center justify-between gap-2">
                  <span className="text-slate-700 leading-snug flex-1">
                    <span className="font-mono text-slate-400 mr-1.5">{idx + 1}.</span>
                    {req}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleRemoveRequirement(idx)}
                    className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-50 transition cursor-pointer shrink-0"
                    title="Remove requirement"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* Add Custom Requirement */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={newRequirement}
                onChange={e => setNewRequirement(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddRequirement();
                  }
                }}
                placeholder="Type custom requirement (e.g. 'Six-seat dining setup', 'Acoustic work desk', 'Pooja room Vastu niche')"
                className="flex-1 px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-xs text-slate-800 placeholder-slate-400"
              />
              <button
                type="button"
                onClick={handleAddRequirement}
                disabled={!newRequirement.trim()}
                className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold text-xs transition flex items-center gap-1 cursor-pointer shrink-0"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add</span>
              </button>
            </div>
          </div>

          {/* Regenerate Layouts Checkbox */}
          <div className="bg-amber-50 p-2.5 rounded-lg border border-amber-200 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="regenerateLayoutsCheck"
                checked={regenerateLayouts}
                onChange={e => setRegenerateLayouts(e.target.checked)}
                className="w-4 h-4 text-purple-600 rounded border-slate-300 focus:ring-purple-500 cursor-pointer"
              />
              <label htmlFor="regenerateLayoutsCheck" className="text-xs font-medium text-amber-900 cursor-pointer">
                Automatically re-synthesize 3–5 spatial furniture layouts to match new requirements
              </label>
            </div>
            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-200/80 text-amber-900">
              AI ADAPTIVE
            </span>
          </div>

          {/* Modal Footer Controls */}
          <div className="pt-3 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
            <button
              type="button"
              onClick={onResetToStandalone}
              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer border border-slate-200"
              title="Reset back to default standalone 2BHK ₹18L scenario"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
              <span>Reset to Standalone (2BHK ₹18L)</span>
            </button>

            <div className="flex items-center gap-2 ml-auto">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition border border-slate-300 cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-800 hover:to-indigo-800 text-white font-bold text-xs transition flex items-center gap-1.5 shadow-sm cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                <span>Save &amp; Apply Requirements</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
