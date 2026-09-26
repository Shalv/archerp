import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  X, 
  Compass, 
  CheckCircle2, 
  AlertCircle, 
  Building, 
  Ruler, 
  Layers, 
  ArrowRight, 
  SlidersHorizontal, 
  Maximize2, 
  Minimize2, 
  Check, 
  Info, 
  Flame, 
  Droplets, 
  Wind, 
  Mountain, 
  Sun,
  ShieldCheck,
  ChevronRight,
  BookOpen,
  Image as ImageIcon
} from 'lucide-react';
import { ArchitecturalFloorPlanViewer } from './ArchitecturalFloorPlanViewer';
import { 
  VastuLayoutOption, 
  VastuLayoutSuggestionResponse, 
  VastuRoomSuggestion, 
  ProjectRecord, 
  RoomSpace, 
  CustomerRequirement 
} from '../types/erp';

interface AIVastuLayoutSuggesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  project?: ProjectRecord | null;
  onApplyLayoutToProject?: (option: VastuLayoutOption, rooms: RoomSpace[], totalCarpet: number, totalBuiltUp: number) => void;
  initialArea?: number;
  initialPropertyType?: string;
  initialFacing?: string;
}

export const AIVastuLayoutSuggesterModal: React.FC<AIVastuLayoutSuggesterModalProps> = ({
  isOpen,
  onClose,
  project,
  onApplyLayoutToProject,
  initialArea,
  initialPropertyType,
  initialFacing
}) => {
  // Input parameters
  const [areaSqFt, setAreaSqFt] = useState<number>(() => {
    return initialArea || project?.requirement?.carpetAreaSqFt || project?.carpetAreaSqFt || 2500;
  });
  const [propertyType, setPropertyType] = useState<string>(() => {
    return initialPropertyType || project?.projectType || 'RESIDENTIAL_VILLA';
  });
  const [facingDirection, setFacingDirection] = useState<string>(initialFacing || 'EAST');
  const [floorsCount, setFloorsCount] = useState<number>(() => {
    return (areaSqFt > 3000 ? 2 : 1);
  });
  const [lifestyleNotes, setLifestyleNotes] = useState<string>('');

  // Generation state
  const [loading, setLoading] = useState<boolean>(false);
  const [response, setResponse] = useState<VastuLayoutSuggestionResponse | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [appliedOptionId, setAppliedOptionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'floorplan' | 'options' | 'mandala' | 'guidelines'>('floorplan');

  // Quick area pills
  const QUICK_AREAS = [1200, 1800, 2500, 3200, 4500];

  const PROPERTY_TYPES = [
    { id: 'RESIDENTIAL_VILLA', label: 'Villa / Bungalow', icon: '🏡' },
    { id: 'APARTMENT', label: 'Apartment / Flat', icon: '🏢' },
    { id: 'DUPLEX', label: 'Duplex House', icon: '🏘️' },
    { id: 'PENTHOUSE', label: 'Luxury Penthouse', icon: '🏙️' },
    { id: 'COMMERCIAL_OFFICE', label: 'Commercial Office', icon: '💼' },
    { id: 'FARMHOUSE', label: 'Farmhouse / Estate', icon: '🌳' }
  ];

  const FACING_OPTIONS = [
    { id: 'EAST', label: 'East (Purva) — Surya Prana', score: 'Highest' },
    { id: 'NORTH', label: 'North (Uttar) — Kuber Wealth', score: 'Highest' },
    { id: 'NORTH_EAST', label: 'North-East (Ishanya) — Divine', score: 'Supreme' },
    { id: 'WEST', label: 'West (Pashchim) — Varuna Stability', score: 'Good' },
    { id: 'SOUTH', label: 'South (Dakshin) — Yama Grounding', score: 'Neutral' }
  ];

  // Fetch Vastu layout suggestions
  const handleGenerate = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/suggest-vastu-layouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          areaSqFt: Number(areaSqFt) || 2500,
          propertyType,
          facingDirection,
          floorsCount: Number(floorsCount) || 1,
          lifestyleNotes
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to generate layout suggestions');
      }

      const data: VastuLayoutSuggestionResponse = await res.json();
      setResponse(data);
      setSelectedOptionIndex(0);
      setAppliedOptionId(null);
    } catch (err: any) {
      setError(err.message || 'Error communicating with Vastu AI engine.');
    } finally {
      setLoading(false);
    }
  };

  // Initial generation on open if not already fetched
  useEffect(() => {
    if (isOpen && !response && !loading) {
      handleGenerate();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const currentOption = response?.options?.[selectedOptionIndex] || null;

  // Convert Vastu room suggestions into standard RoomSpace items for project saving
  const handleApply = () => {
    if (!currentOption) return;

    const convertedRooms: RoomSpace[] = currentOption.rooms.map((r, idx) => {
      const perimeter = Math.round(2 * (r.lengthFt + r.widthFt) * 10) / 10;
      const wallArea = Math.round(perimeter * (r.heightFt || 10.5) * 10) / 10;
      return {
        id: `RM-${Date.now()}-${idx + 1}`,
        name: r.name,
        zone: r.zone || 'Living Zone',
        floor: r.floor || 'Ground Floor',
        lengthFt: r.lengthFt,
        widthFt: r.widthFt,
        heightFt: r.heightFt || 10.5,
        carpetAreaSqFt: r.carpetAreaSqFt,
        perimeterFt: perimeter,
        wallAreaSqFt: wallArea,
        ceilingAreaSqFt: r.carpetAreaSqFt,
        existingCondition: 'Bare shell screed floor',
        demolitionRequired: false,
        notes: `Vastu: ${r.vastuDirection} (${r.vastuElement}) - ${r.vastuSignificance}`,
        vastuDirection: r.vastuDirection,
        vastuElement: r.vastuElement
      };
    });

    if (onApplyLayoutToProject) {
      onApplyLayoutToProject(
        currentOption,
        convertedRooms,
        currentOption.totalCarpetSqFt,
        currentOption.totalBuiltUpSqFt
      );
    }

    setAppliedOptionId(currentOption.id);
  };

  // Helper for directional quadrant coloring
  const getDirectionBadge = (dir: string) => {
    if (dir.includes('Ishanya') || dir.includes('North-East')) {
      return { bg: 'bg-cyan-50 border-cyan-200 text-cyan-800', icon: Droplets, label: 'Water (Jal)' };
    }
    if (dir.includes('Agni') || dir.includes('South-East')) {
      return { bg: 'bg-amber-50 border-amber-200 text-amber-800', icon: Flame, label: 'Fire (Agni)' };
    }
    if (dir.includes('Nairutya') || dir.includes('South-West')) {
      return { bg: 'bg-emerald-50 border-emerald-200 text-emerald-800', icon: Mountain, label: 'Earth (Prithvi)' };
    }
    if (dir.includes('Vayu') || dir.includes('North-West')) {
      return { bg: 'bg-indigo-50 border-indigo-200 text-indigo-800', icon: Wind, label: 'Air (Vayu)' };
    }
    if (dir.includes('Brahmasthan') || dir.includes('Center')) {
      return { bg: 'bg-purple-50 border-purple-200 text-purple-800', icon: Sun, label: 'Space (Akash)' };
    }
    return { bg: 'bg-blue-50 border-blue-200 text-blue-800', icon: Compass, label: 'Prana Solar' };
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-2 sm:p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-6xl max-h-[94vh] flex flex-col overflow-hidden text-slate-900">
        
        {/* Modal Header */}
        <div className="px-5 py-4 bg-gradient-to-r from-[#002050] via-[#0c366e] to-[#0f6cbd] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <Compass className="w-5 h-5 text-amber-300 animate-spin-slow" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  AI Vastu Shastra Layout Optimizer
                </h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-400 text-slate-950 uppercase tracking-wider">
                  3 Options Engine
                </span>
              </div>
              <p className="text-xs text-blue-100 mt-0.5">
                Dynamic room breakdown, directional zoning, dimensions and Vastu compliance scores
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-white/80 hover:text-white hover:bg-white/10 transition cursor-pointer"
            title="Close Vastu Optimizer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Input Parameters Control Strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <form onSubmit={handleGenerate} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end text-xs">
            {/* 1. Construction Area */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Construction Area (sq.ft) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="500"
                  max="50000"
                  step="50"
                  value={areaSqFt}
                  onChange={e => setAreaSqFt(Number(e.target.value) || 0)}
                  className="w-full pl-3 pr-12 py-2 rounded-lg border border-slate-300 font-mono font-bold text-sm text-slate-900 bg-white focus:ring-2 focus:ring-[#0f6cbd] focus:border-[#0f6cbd]"
                  placeholder="e.g. 2500"
                  required
                />
                <span className="absolute right-2.5 top-2.5 text-xs text-slate-400 font-semibold">sq.ft</span>
              </div>
              {/* Quick Pills */}
              <div className="flex items-center gap-1 mt-1.5 overflow-x-auto">
                {QUICK_AREAS.map(a => (
                  <button
                    key={a}
                    type="button"
                    onClick={() => setAreaSqFt(a)}
                    className={`px-1.5 py-0.5 rounded text-[10px] font-semibold transition cursor-pointer ${
                      areaSqFt === a 
                        ? 'bg-[#0f6cbd] text-white' 
                        : 'bg-slate-200 text-slate-700 hover:bg-slate-300'
                    }`}
                  >
                    {a.toLocaleString()}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Property Type */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Property Typology
              </label>
              <select
                value={propertyType}
                onChange={e => setPropertyType(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0f6cbd]"
              >
                {PROPERTY_TYPES.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.icon} {p.label}
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-slate-500 mt-1">
                {floorsCount > 1 ? `${floorsCount} Levels (G+${floorsCount - 1})` : 'Single Level Layout'}
              </div>
            </div>

            {/* 3. Main Entrance / Facing Direction */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Plot / Main Door Facing
              </label>
              <select
                value={facingDirection}
                onChange={e => setFacingDirection(e.target.value)}
                className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-slate-800 focus:ring-2 focus:ring-[#0f6cbd]"
              >
                {FACING_OPTIONS.map(f => (
                  <option key={f.id} value={f.id}>
                    {f.label}
                  </option>
                ))}
              </select>
              <div className="text-[10px] text-emerald-600 font-semibold mt-1 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>Verified Auspicious Pada</span>
              </div>
            </div>

            {/* 4. Number of Floors */}
            <div>
              <label className="block text-[11px] font-bold text-slate-700 mb-1">
                Floors &amp; Configuration
              </label>
              <div className="grid grid-cols-3 gap-1">
                {[1, 2, 3].map(fl => (
                  <button
                    key={fl}
                    type="button"
                    onClick={() => setFloorsCount(fl)}
                    className={`py-2 rounded-lg text-xs font-bold border transition cursor-pointer text-center ${
                      floorsCount === fl
                        ? 'bg-[#0f6cbd] text-white border-[#0f6cbd]'
                        : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                    }`}
                  >
                    {fl === 1 ? '1 Floor' : fl === 2 ? 'G+1' : 'G+2'}
                  </button>
                ))}
              </div>
              <div className="text-[10px] text-slate-500 mt-1">
                Vertical zoning split
              </div>
            </div>

            {/* 5. Generate Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2 px-4 rounded-lg bg-gradient-to-r from-[#002050] to-[#0f6cbd] hover:from-[#0c366e] hover:to-[#0b5a9e] text-white text-xs font-bold shadow-sm flex items-center justify-center gap-1.5 transition disabled:opacity-50 cursor-pointer"
              >
                {loading ? (
                  <>
                    <Compass className="w-4 h-4 animate-spin" />
                    <span>Calculating Vastu...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>Generate 3 Layouts</span>
                  </>
                )}
              </button>
              <div className="text-[10px] text-center text-slate-400 mt-1">
                Gemini 3.8 + Vastu Vidya
              </div>
            </div>
          </form>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 border-b border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-5 space-y-4">
          {loading && (
            <div className="py-20 text-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 border border-blue-200 text-[#0f6cbd] flex items-center justify-center mx-auto shadow-sm animate-pulse">
                <Compass className="w-8 h-8 animate-spin" />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  Synthesizing 3 Vastu-Compliant Layout Possibilities for {areaSqFt.toLocaleString()} sq.ft
                </h3>
                <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                  Aligning master bedroom to South-West, kitchen to South-East Agni, sacred Pooja mandir to North-East Ishanya, and preserving central Brahmasthan...
                </p>
              </div>
            </div>
          )}

          {!loading && response && (
            <>
              {/* Option Selector Tabs */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                <div className="flex items-center gap-2 overflow-x-auto">
                  {response.options.map((opt, idx) => (
                    <button
                      key={opt.id}
                      onClick={() => setSelectedOptionIndex(idx)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 cursor-pointer border ${
                        selectedOptionIndex === idx
                          ? 'bg-[#002050] text-white border-[#002050] shadow-sm'
                          : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                      }`}
                    >
                      <span className={`w-5 h-5 rounded-full text-[11px] flex items-center justify-center ${
                        selectedOptionIndex === idx ? 'bg-amber-400 text-slate-950' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {idx + 1}
                      </span>
                      <span>Option {idx + 1}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                        selectedOptionIndex === idx ? 'bg-white/20 text-amber-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {opt.vastuScore}% Vastu
                      </span>
                    </button>
                  ))}
                </div>

                {/* Subview Tabs: Floor Plan Drawing vs Options Breakdown vs 9-Quadrant Vastu Grid vs Guidelines */}
                <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
                  <button
                    onClick={() => setActiveTab('floorplan')}
                    className={`px-3 py-1.5 rounded-md font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                      activeTab === 'floorplan' ? 'bg-[#002050] text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
                    }`}
                  >
                    <ImageIcon className="w-3.5 h-3.5 text-amber-300" />
                    <span>Architectural Floor Plan</span>
                  </button>
                  <button
                    onClick={() => setActiveTab('options')}
                    className={`px-2.5 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                      activeTab === 'options' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Room Schedule &amp; Dimensions
                  </button>
                  <button
                    onClick={() => setActiveTab('mandala')}
                    className={`px-2.5 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                      activeTab === 'mandala' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    9-Grid Vastu Matrix
                  </button>
                  <button
                    onClick={() => setActiveTab('guidelines')}
                    className={`px-2.5 py-1.5 rounded-md font-semibold transition cursor-pointer ${
                      activeTab === 'guidelines' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    Vastu Principles
                  </button>
                </div>
              </div>

              {/* Floor Plan Architectural Drawing Tab */}
              {currentOption && activeTab === 'floorplan' && (
                <div className="space-y-4">
                  <ArchitecturalFloorPlanViewer
                    layoutOption={currentOption}
                    project={project}
                    onApplyLayout={handleApply}
                    isApplied={appliedOptionId === currentOption.id}
                  />

                  {/* Quick Dimensional Callouts Summary Strip */}
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-[#0f6cbd]" />
                        <span className="text-xs font-bold text-slate-900">
                          Key Architectural Room Dimensions ({currentOption.configuration})
                        </span>
                      </div>
                      <button
                        onClick={() => setActiveTab('options')}
                        className="text-xs text-[#0f6cbd] font-semibold hover:underline flex items-center gap-1 cursor-pointer"
                      >
                        <span>View Full Room Schedule</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                      {currentOption.rooms.slice(0, 4).map((r, i) => (
                        <div key={i} className="p-2.5 bg-white border border-slate-200 rounded-lg shadow-2xs">
                          <div className="font-semibold text-slate-800 text-[11px] truncate">{r.name}</div>
                          <div className="text-[#0f6cbd] font-mono font-bold text-xs mt-0.5">
                            {r.lengthFt}' × {r.widthFt}' ({r.carpetAreaSqFt} sq.ft)
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                            <span>{r.vastuDirection}</span>
                            <span className="text-amber-700 font-medium">{r.vastuElement}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {currentOption && activeTab === 'options' && (
                <div className="space-y-4">
                  {/* Option Highlight Header Card */}
                  <div className="bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 border border-blue-100 rounded-xl p-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-bold text-[#0f6cbd] uppercase tracking-wider">
                            Option {currentOption.optionNumber} of 3
                          </span>
                          <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md border border-emerald-200">
                            ★ {currentOption.vastuScore}/100 Vastu Pure
                          </span>
                          <span className="bg-slate-200 text-slate-700 text-[11px] font-medium px-2 py-0.5 rounded-md">
                            {currentOption.configuration}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 mt-1">
                          {currentOption.title}
                        </h3>
                        <p className="text-xs text-slate-600 mt-0.5">
                          {currentOption.tagline}
                        </p>
                      </div>

                      {/* Apply & Floor Plan buttons */}
                      <div className="shrink-0 flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveTab('floorplan')}
                          className="px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 transition flex items-center gap-1.5 shadow-2xs cursor-pointer"
                        >
                          <ImageIcon className="w-4 h-4 text-[#0f6cbd]" />
                          <span>View CAD Blueprint</span>
                        </button>
                        <button
                          type="button"
                          onClick={handleApply}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-sm cursor-pointer ${
                            appliedOptionId === currentOption.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-[#0f6cbd] hover:bg-[#0b5a9e] text-white'
                          }`}
                        >
                          {appliedOptionId === currentOption.id ? (
                            <>
                              <Check className="w-4 h-4" />
                              <span>Applied to Project Job Card!</span>
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                              <span>Apply to Project Site Survey &amp; Rooms</span>
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* KPI Metric Strip */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-3 pt-3 border-t border-slate-200/80 text-xs">
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">Total Built-Up</span>
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          {currentOption.totalBuiltUpSqFt.toLocaleString()} sq.ft
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">Net Usable Carpet</span>
                        <span className="text-sm font-bold text-[#0f6cbd] font-mono">
                          {currentOption.totalCarpetSqFt.toLocaleString()} sq.ft
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">Carpet Efficiency</span>
                        <span className="text-sm font-bold text-emerald-700 font-mono">
                          {currentOption.carpetRatioPercent}% (Optimal)
                        </span>
                      </div>
                      <div className="bg-white p-2.5 rounded-lg border border-slate-200">
                        <span className="text-[10px] text-slate-500 font-semibold block uppercase">Total Spaces Planned</span>
                        <span className="text-sm font-bold text-slate-900 font-mono">
                          {currentOption.rooms.length} Vastu Rooms
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Vastu Directorial Checkpoints Bar */}
                  <div className="bg-white rounded-xl border border-slate-200 p-3 shadow-2xs">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 mb-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      <span>Vastu Purusha Cardinal Alignments for {currentOption.title}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 text-xs">
                      <div className="p-2 rounded-lg bg-cyan-50/60 border border-cyan-100">
                        <span className="font-bold text-cyan-900 block text-[11px]">North-East (Ishanya):</span>
                        <span className="text-cyan-800 text-[11px]">{currentOption.vastuHighlights.poojaRoom}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-amber-50/60 border border-amber-100">
                        <span className="font-bold text-amber-900 block text-[11px]">South-East (Agni):</span>
                        <span className="text-amber-800 text-[11px]">{currentOption.vastuHighlights.kitchen}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-emerald-50/60 border border-emerald-100">
                        <span className="font-bold text-emerald-900 block text-[11px]">South-West (Nairutya):</span>
                        <span className="text-emerald-800 text-[11px]">{currentOption.vastuHighlights.masterBedroom}</span>
                      </div>
                      <div className="p-2 rounded-lg bg-purple-50/60 border border-purple-100">
                        <span className="font-bold text-purple-900 block text-[11px]">Center (Brahmasthan):</span>
                        <span className="text-purple-800 text-[11px]">{currentOption.vastuHighlights.brahmasthan}</span>
                      </div>
                    </div>
                  </div>

                  {/* Room Breakdown Table */}
                  <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs">
                    <div className="px-4 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-[#0f6cbd]" />
                        <span className="text-xs font-bold text-slate-800">
                          Room Dimensions &amp; Spatial Schedule ({currentOption.rooms.length} Defined Spaces)
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-mono">
                        Sum: {currentOption.rooms.reduce((acc, r) => acc + r.carpetAreaSqFt, 0).toLocaleString()} sq.ft
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead className="bg-slate-100/80 text-slate-700 font-semibold border-b border-slate-200">
                          <tr>
                            <th className="p-2.5 whitespace-nowrap">Room Space</th>
                            <th className="p-2.5 whitespace-nowrap">Floor</th>
                            <th className="p-2.5 whitespace-nowrap">Dimensions (L × W × H)</th>
                            <th className="p-2.5 text-right whitespace-nowrap">Carpet Area</th>
                            <th className="p-2.5 whitespace-nowrap">Vastu Direction &amp; Element</th>
                            <th className="p-2.5">Vastu Significance &amp; Features</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {currentOption.rooms.map((room, rIdx) => {
                            const badge = getDirectionBadge(room.vastuDirection);
                            const IconComp = badge.icon;
                            return (
                              <tr key={rIdx} className="hover:bg-slate-50/80 transition-colors">
                                <td className="p-2.5 font-bold text-slate-900 whitespace-nowrap">
                                  {room.name}
                                  <span className="block text-[10px] text-slate-400 font-normal">{room.zone}</span>
                                </td>
                                <td className="p-2.5 text-slate-600 whitespace-nowrap">
                                  {room.floor}
                                </td>
                                <td className="p-2.5 font-mono text-slate-800 whitespace-nowrap">
                                  {room.lengthFt} ft × {room.widthFt} ft × {room.heightFt || 10.5} ft
                                </td>
                                <td className="p-2.5 text-right font-mono font-bold text-[#0f6cbd] whitespace-nowrap">
                                  {room.carpetAreaSqFt} sq.ft
                                </td>
                                <td className="p-2.5 whitespace-nowrap">
                                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[11px] font-semibold ${badge.bg}`}>
                                    <IconComp className="w-3 h-3" />
                                    <span>{room.vastuDirection}</span>
                                  </span>
                                  <span className="block text-[10px] text-slate-500 mt-0.5">{room.vastuElement}</span>
                                </td>
                                <td className="p-2.5 text-slate-700 max-w-sm">
                                  <p className="leading-snug">{room.vastuSignificance}</p>
                                  {room.recommendedFeatures && room.recommendedFeatures.length > 0 && (
                                    <div className="flex flex-wrap gap-1 mt-1">
                                      {room.recommendedFeatures.map((feat, fIdx) => (
                                        <span key={fIdx} className="text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded border border-slate-200">
                                          ✓ {feat}
                                        </span>
                                      ))}
                                    </div>
                                  )}
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Option Pros & Recommendation Footer */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="p-3 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-1">
                      <span className="font-bold text-emerald-900 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                        <span>Core Architectural Advantages</span>
                      </span>
                      <ul className="space-y-1 text-emerald-800 pl-5 list-disc text-[11px]">
                        {currentOption.pros.map((p, idx) => (
                          <li key={idx}>{p}</li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 bg-blue-50/60 border border-blue-200 rounded-xl space-y-1">
                      <span className="font-bold text-blue-900 flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-blue-600" />
                        <span>Best Suited Profile</span>
                      </span>
                      <p className="text-blue-800 text-[11px] leading-relaxed">
                        {currentOption.bestSuitedFor}
                      </p>
                      <p className="text-[11px] text-slate-600 italic mt-1">
                        Note: {currentOption.architecturalNotes}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* 9-Grid Vastu Matrix Subview */}
              {activeTab === 'mandala' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-700 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">Vastu Purusha 9-Quadrant Spatial Matrix:</span>
                      <span className="text-slate-600 ml-1">Spatial orientation of rooms for Option {currentOption.optionNumber} ({currentOption.title})</span>
                    </div>
                    <span className="font-mono text-xs font-bold text-[#0f6cbd]">Facing: {facingDirection}</span>
                  </div>

                  {/* 3x3 Vastu Grid */}
                  <div className="grid grid-cols-3 gap-2.5 max-w-3xl mx-auto">
                    {/* NW: Vayu */}
                    <div className="bg-indigo-50 border-2 border-indigo-200 rounded-xl p-3 text-xs flex flex-col justify-between min-h-[140px]">
                      <div>
                        <div className="flex items-center justify-between text-indigo-900 font-bold border-b border-indigo-200 pb-1">
                          <span>North-West (NW)</span>
                          <span className="text-[10px] bg-indigo-100 px-1 rounded">Vayu / Air</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {currentOption.rooms.filter(r => r.vastuDirection.includes('North-West') || r.vastuDirection.includes('Vayu')).map((r, i) => (
                            <div key={i} className="font-semibold text-slate-900 bg-white p-1 rounded border border-indigo-100 shadow-2xs text-[11px]">
                              {r.name} ({r.carpetAreaSqFt} sq.ft)
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-indigo-700 mt-2">Ideal: Guest Bed, Powder Room, Utility</span>
                    </div>

                    {/* N: Kuber */}
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-3 text-xs flex flex-col justify-between min-h-[140px]">
                      <div>
                        <div className="flex items-center justify-between text-blue-900 font-bold border-b border-blue-200 pb-1">
                          <span>North (N)</span>
                          <span className="text-[10px] bg-blue-100 px-1 rounded">Kuber / Wealth</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {currentOption.rooms.filter(r => r.vastuDirection.includes('North') && !r.vastuDirection.includes('East') && !r.vastuDirection.includes('West')).map((r, i) => (
                            <div key={i} className="font-semibold text-slate-900 bg-white p-1 rounded border border-blue-100 shadow-2xs text-[11px]">
                              {r.name} ({r.carpetAreaSqFt} sq.ft)
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-blue-700 mt-2">Ideal: Main Entrance, Living, Cash Desk</span>
                    </div>

                    {/* NE: Ishanya */}
                    <div className="bg-cyan-50 border-2 border-cyan-300 rounded-xl p-3 text-xs flex flex-col justify-between min-h-[140px] shadow-xs">
                      <div>
                        <div className="flex items-center justify-between text-cyan-950 font-bold border-b border-cyan-200 pb-1">
                          <span className="flex items-center gap-1">
                            <Droplets className="w-3.5 h-3.5 text-cyan-600" />
                            <span>North-East (NE)</span>
                          </span>
                          <span className="text-[10px] bg-cyan-200 text-cyan-900 px-1 rounded font-bold">Ishanya / Water</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {currentOption.rooms.filter(r => r.vastuDirection.includes('North-East') || r.vastuDirection.includes('Ishanya')).map((r, i) => (
                            <div key={i} className="font-semibold text-slate-900 bg-white p-1 rounded border border-cyan-200 shadow-2xs text-[11px]">
                              {r.name} ({r.carpetAreaSqFt} sq.ft)
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-cyan-800 font-semibold mt-2">Sacred: Pooja Mandir, Water Tank</span>
                    </div>

                    {/* W: Varuna */}
                    <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-3 text-xs flex flex-col justify-between min-h-[140px]">
                      <div>
                        <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-1">
                          <span>West (W)</span>
                          <span className="text-[10px] bg-slate-200 px-1 rounded">Varuna / Gains</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {currentOption.rooms.filter(r => r.vastuDirection.includes('West') && !r.vastuDirection.includes('North') && !r.vastuDirection.includes('South')).map((r, i) => (
                            <div key={i} className="font-semibold text-slate-900 bg-white p-1 rounded border border-slate-200 shadow-2xs text-[11px]">
                              {r.name} ({r.carpetAreaSqFt} sq.ft)
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-600 mt-2">Ideal: Children Bed, Dining, Study</span>
                    </div>

                    {/* Center: Brahmasthan */}
                    <div className="bg-purple-50/80 border-2 border-purple-300 rounded-xl p-3 text-xs flex flex-col justify-between min-h-[140px] shadow-sm">
                      <div>
                        <div className="flex items-center justify-between text-purple-950 font-bold border-b border-purple-200 pb-1">
                          <span className="flex items-center gap-1">
                            <Sun className="w-3.5 h-3.5 text-amber-500" />
                            <span>Brahmasthan</span>
                          </span>
                          <span className="text-[10px] bg-purple-200 text-purple-900 px-1 rounded font-bold">Space / Akash</span>
                        </div>
                        <div className="mt-2 p-2 bg-white rounded border border-purple-200 text-center">
                          <span className="text-[11px] font-bold text-purple-900 block">Open Courtyard / Circulation</span>
                          <span className="text-[10px] text-purple-700">Completely open &amp; uncluttered</span>
                        </div>
                      </div>
                      <span className="text-[10px] text-purple-800 font-semibold mt-2">Strictly: No walls, toilets, or columns</span>
                    </div>

                    {/* E: Surya */}
                    <div className="bg-amber-50/60 border-2 border-amber-200 rounded-xl p-3 text-xs flex flex-col justify-between min-h-[140px]">
                      <div>
                        <div className="flex items-center justify-between text-amber-950 font-bold border-b border-amber-200 pb-1">
                          <span>East (E)</span>
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1 rounded">Surya / Solar</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {currentOption.rooms.filter(r => r.vastuDirection.includes('East') && !r.vastuDirection.includes('North') && !r.vastuDirection.includes('South')).map((r, i) => (
                            <div key={i} className="font-semibold text-slate-900 bg-white p-1 rounded border border-amber-100 shadow-2xs text-[11px]">
                              {r.name} ({r.carpetAreaSqFt} sq.ft)
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-800 mt-2">Ideal: Main Foyer, Verandah, Living</span>
                    </div>

                    {/* SW: Nairutya */}
                    <div className="bg-emerald-50 border-2 border-emerald-300 rounded-xl p-3 text-xs flex flex-col justify-between min-h-[140px] shadow-xs">
                      <div>
                        <div className="flex items-center justify-between text-emerald-950 font-bold border-b border-emerald-200 pb-1">
                          <span className="flex items-center gap-1">
                            <Mountain className="w-3.5 h-3.5 text-emerald-700" />
                            <span>South-West (SW)</span>
                          </span>
                          <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1 rounded font-bold">Nairutya / Earth</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {currentOption.rooms.filter(r => r.vastuDirection.includes('South-West') || r.vastuDirection.includes('Nairutya')).map((r, i) => (
                            <div key={i} className="font-semibold text-slate-900 bg-white p-1 rounded border border-emerald-200 shadow-2xs text-[11px]">
                              {r.name} ({r.carpetAreaSqFt} sq.ft)
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-emerald-800 font-semibold mt-2">Master Suite: Head of Family &amp; Authority</span>
                    </div>

                    {/* S: Yama */}
                    <div className="bg-slate-50 border-2 border-slate-300 rounded-xl p-3 text-xs flex flex-col justify-between min-h-[140px]">
                      <div>
                        <div className="flex items-center justify-between text-slate-900 font-bold border-b border-slate-200 pb-1">
                          <span>South (S)</span>
                          <span className="text-[10px] bg-slate-200 px-1 rounded">Yama / Earth</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {currentOption.rooms.filter(r => r.vastuDirection.includes('South') && !r.vastuDirection.includes('East') && !r.vastuDirection.includes('West')).map((r, i) => (
                            <div key={i} className="font-semibold text-slate-900 bg-white p-1 rounded border border-slate-200 shadow-2xs text-[11px]">
                              {r.name} ({r.carpetAreaSqFt} sq.ft)
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-slate-600 mt-2">Ideal: Staircase core, Heavy storage</span>
                    </div>

                    {/* SE: Agni */}
                    <div className="bg-amber-100/70 border-2 border-amber-300 rounded-xl p-3 text-xs flex flex-col justify-between min-h-[140px] shadow-xs">
                      <div>
                        <div className="flex items-center justify-between text-amber-950 font-bold border-b border-amber-300 pb-1">
                          <span className="flex items-center gap-1">
                            <Flame className="w-3.5 h-3.5 text-amber-700" />
                            <span>South-East (SE)</span>
                          </span>
                          <span className="text-[10px] bg-amber-300 text-amber-950 px-1 rounded font-bold">Agni / Fire</span>
                        </div>
                        <div className="mt-2 space-y-1">
                          {currentOption.rooms.filter(r => r.vastuDirection.includes('South-East') || r.vastuDirection.includes('Agni')).map((r, i) => (
                            <div key={i} className="font-semibold text-slate-900 bg-white p-1 rounded border border-amber-300 shadow-2xs text-[11px]">
                              {r.name} ({r.carpetAreaSqFt} sq.ft)
                            </div>
                          ))}
                        </div>
                      </div>
                      <span className="text-[10px] text-amber-900 font-semibold mt-2">Modular Kitchen (Cook faces East), Utility</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Vastu Vidya Principles Subview */}
              {activeTab === 'guidelines' && (
                <div className="space-y-4">
                  <div className="bg-white rounded-xl border border-slate-200 p-4">
                    <h4 className="text-sm font-bold text-slate-900 mb-2 flex items-center gap-2">
                      <BookOpen className="w-4 h-4 text-[#0f6cbd]" />
                      <span>Certified Vastu Shastra Cardinal Guidelines (Mayamatam Standard)</span>
                    </h4>
                    <p className="text-xs text-slate-600 mb-4">
                      Vastu Shastra balances the Pancha Bhutas (Five Great Elements: Earth, Water, Fire, Air, Space) with gravitational, magnetic, and solar cosmic radiation to create vibrant living health.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      {response.vastuCompassGuidelines.map((guide, gIdx) => (
                        <div key={gIdx} className="p-3 rounded-xl border border-slate-200 bg-slate-50 space-y-1.5">
                          <div className="flex items-center justify-between font-bold text-slate-900">
                            <span>{guide.direction}</span>
                            <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                              {guide.element}
                            </span>
                          </div>
                          <div className="text-[11px] text-slate-500">Deity / Governing Cosmic Force: {guide.deity}</div>
                          
                          <div className="pt-1">
                            <span className="font-semibold text-emerald-800 block text-[11px]">✓ Recommended Spaces:</span>
                            <span className="text-slate-700 text-[11px]">{guide.recommendedRooms.join(', ')}</span>
                          </div>

                          <div className="pt-1">
                            <span className="font-semibold text-rose-800 block text-[11px]">✕ Strictly Avoid:</span>
                            <span className="text-slate-600 text-[11px]">{guide.strictlyAvoid.join(', ')}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-5 py-3.5 bg-slate-100 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="text-xs text-slate-600">
            {currentOption && (
              <span>
                Active Selection: <strong>Option {currentOption.optionNumber}</strong> ({currentOption.rooms.length} Rooms • {currentOption.totalCarpetSqFt.toLocaleString()} sq.ft Carpet)
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
            >
              Close
            </button>
            {currentOption && (
              <button
                type="button"
                onClick={handleApply}
                className="px-5 py-2 rounded-lg bg-[#0f6cbd] hover:bg-[#0b5a9e] text-white text-xs font-bold shadow-sm transition flex items-center gap-1.5 cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Apply Layout to Project</span>
              </button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
