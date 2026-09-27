import React, { useState, useEffect, useRef } from 'react';
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
  Image as ImageIcon,
  Download,
  FileImage,
  FileCode,
  RefreshCw,
  Zap
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
import {
  downloadFloorPlanSvg,
  downloadFloorPlanPng,
  downloadFloorPlanSpecificationJson
} from '../utils/floorPlanSvgGenerator';
import {
  downloadCadFile,
  generateCadZipBundle,
  CadFileExtension
} from '../utils/cadExportGenerator';
import { Cpu, PackageCheck } from 'lucide-react';

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
  // Input parameters: Defaults to 1200 sq.ft (standard 30' × 40' plot) if not otherwise set
  const [areaSqFt, setAreaSqFt] = useState<number>(() => {
    return initialArea || project?.requirement?.plotAreaSqFt || (project?.carpetAreaSqFt && project.carpetAreaSqFt > 0 ? project.carpetAreaSqFt : 1200);
  });
  const [plotWidthFt, setPlotWidthFt] = useState<number>(() => {
    const area = initialArea || 1200;
    if (area === 1200) return 30;
    if (area === 1500) return 30;
    if (area === 1800) return 30;
    if (area === 2400) return 40;
    return Math.round(Math.sqrt(area * 0.75));
  });
  const [plotDepthFt, setPlotDepthFt] = useState<number>(() => {
    const area = initialArea || 1200;
    if (area === 1200) return 40;
    if (area === 1500) return 50;
    if (area === 1800) return 60;
    if (area === 2400) return 60;
    const w = Math.round(Math.sqrt(area * 0.75)) || 30;
    return Math.round(area / w);
  });

  const [propertyType, setPropertyType] = useState<string>(() => {
    return initialPropertyType || project?.projectType || 'RESIDENTIAL_VILLA';
  });
  const [facingDirection, setFacingDirection] = useState<string>(initialFacing || 'EAST');
  const [floorsCount, setFloorsCount] = useState<number>(() => {
    return (areaSqFt > 3000 ? 2 : 1);
  });
  const [lifestyleNotes, setLifestyleNotes] = useState<string>('');

  // Generation & Live Sync state
  const [loading, setLoading] = useState<boolean>(false);
  const [isUpdatingLive, setIsUpdatingLive] = useState<boolean>(false);
  const [autoSyncEnabled, setAutoSyncEnabled] = useState<boolean>(true);
  const [response, setResponse] = useState<VastuLayoutSuggestionResponse | null>(null);
  const [selectedOptionIndex, setSelectedOptionIndex] = useState<number>(0);
  const [error, setError] = useState<string | null>(null);
  const [appliedOptionId, setAppliedOptionId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'floorplan' | 'options' | 'mandala' | 'guidelines'>('floorplan');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef<boolean>(true);

  // Standard Plot Presets with Dimensions
  const QUICK_PRESETS = [
    { area: 1200, width: 30, depth: 40, label: "1,200 sq.ft (30' × 40')", popular: true },
    { area: 1500, width: 30, depth: 50, label: "1,500 sq.ft (30' × 50')", popular: false },
    { area: 1800, width: 30, depth: 60, label: "1,800 sq.ft (30' × 60')", popular: false },
    { area: 2400, width: 40, depth: 60, label: "2,400 sq.ft (40' × 60')", popular: false },
    { area: 3000, width: 50, depth: 60, label: "3,000 sq.ft (50' × 60')", popular: false }
  ];

  const showNotification = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  // Fetch Vastu layout suggestions
  const fetchLayouts = async (overrideParams?: Partial<{
    areaSqFt: number;
    plotWidthFt: number;
    plotDepthFt: number;
    propertyType: string;
    facingDirection: string;
    floorsCount: number;
    lifestyleNotes: string;
  }>, isBackgroundSync = false) => {
    const targetArea = overrideParams?.areaSqFt ?? areaSqFt;
    const targetW = overrideParams?.plotWidthFt ?? plotWidthFt;
    const targetD = overrideParams?.plotDepthFt ?? plotDepthFt;
    const targetProp = overrideParams?.propertyType ?? propertyType;
    const targetFacing = overrideParams?.facingDirection ?? facingDirection;
    const targetFloors = overrideParams?.floorsCount ?? floorsCount;
    const targetNotes = overrideParams?.lifestyleNotes ?? lifestyleNotes;

    if (!isBackgroundSync) {
      setLoading(true);
    } else {
      setIsUpdatingLive(true);
    }
    setError(null);

    try {
      const res = await fetch('/api/ai/suggest-vastu-layouts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          areaSqFt: Number(targetArea) || 1200,
          plotWidthFt: Number(targetW) || 30,
          plotDepthFt: Number(targetD) || 40,
          propertyType: targetProp,
          facingDirection: targetFacing,
          floorsCount: Number(targetFloors) || 1,
          lifestyleNotes: targetNotes
        })
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || 'Failed to generate layout suggestions');
      }

      const data: VastuLayoutSuggestionResponse = await res.json();
      setResponse(data);
      // Keep selected option index if valid, else default to 0
      setSelectedOptionIndex(prev => (prev < data.options.length ? prev : 0));
      setAppliedOptionId(null);
    } catch (err: any) {
      setError(err.message || 'Error communicating with Vastu AI engine.');
    } finally {
      setLoading(false);
      setIsUpdatingLive(false);
    }
  };

  const handleSelectPreset = (pArea: number, pWidth: number, pDepth: number) => {
    setAreaSqFt(pArea);
    setPlotWidthFt(pWidth);
    setPlotDepthFt(pDepth);
    // Immediately fetch layouts for this preset
    fetchLayouts({ areaSqFt: pArea, plotWidthFt: pWidth, plotDepthFt: pDepth }, response !== null);
  };

  const handleAreaChange = (newArea: number) => {
    setAreaSqFt(newArea);
    if (newArea === 1200) {
      setPlotWidthFt(30);
      setPlotDepthFt(40);
    } else if (newArea === 1500) {
      setPlotWidthFt(30);
      setPlotDepthFt(50);
    } else if (newArea === 1800) {
      setPlotWidthFt(30);
      setPlotDepthFt(60);
    } else if (newArea === 2400) {
      setPlotWidthFt(40);
      setPlotDepthFt(60);
    } else if (newArea > 0) {
      const calcWidth = Math.round(Math.sqrt(newArea * 0.75));
      setPlotWidthFt(calcWidth);
      setPlotDepthFt(Math.round(newArea / (calcWidth || 30)));
    }
  };

  const handleDimensionsChange = (newW: number, newD: number) => {
    setPlotWidthFt(newW);
    setPlotDepthFt(newD);
    if (newW > 0 && newD > 0) {
      setAreaSqFt(newW * newD);
    }
  };

  const PROPERTY_TYPES = [
    { id: 'RESIDENTIAL_VILLA', label: 'Villa / Independent Bungalow', icon: '🏡' },
    { id: 'DUPLEX', label: 'Duplex Home (G+1)', icon: '🏘️' },
    { id: 'APARTMENT', label: 'Apartment / Flat', icon: '🏢' },
    { id: 'PENTHOUSE', label: 'Luxury Penthouse', icon: '🏙️' },
    { id: 'COMMERCIAL_OFFICE', label: 'Commercial Office / Tech Hub', icon: '💼' },
    { id: 'FARMHOUSE', label: 'Farmhouse / Estate', icon: '🌳' }
  ];

  const FACING_OPTIONS = [
    { id: 'EAST', label: 'East (Purva) — Surya Prana & Vitality', score: 'Supreme' },
    { id: 'NORTH', label: 'North (Uttar) — Kuber Wealth & Opportunity', score: 'Supreme' },
    { id: 'NORTH_EAST', label: 'North-East (Ishanya) — Divine Purity', score: 'Supreme' },
    { id: 'WEST', label: 'West (Pashchim) — Varuna Stability & Gains', score: 'Good' },
    { id: 'SOUTH', label: 'South (Dakshin) — Yama / Mars Grounding', score: 'Neutral' }
  ];

  // Initial fetch on open
  useEffect(() => {
    if (isOpen && !response && !loading) {
      fetchLayouts();
    }
  }, [isOpen]);

  // Live Auto-Sync: Automatically update visualization & generate fresh files when size or specifications change
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    if (!isOpen || !response || !autoSyncEnabled) return;

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    debounceTimerRef.current = setTimeout(() => {
      fetchLayouts({}, true);
    }, 450);

    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [areaSqFt, plotWidthFt, plotDepthFt, propertyType, facingDirection, floorsCount]);

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

  // Quick file download actions for the current option
  const handleQuickDownloadSvg = () => {
    if (!currentOption) return;
    downloadFloorPlanSvg(currentOption, {
      projectName: project?.title,
      clientName: project?.clientName
    });
    showNotification(`Fresh Vector CAD Blueprint (.SVG) downloaded for ${plotWidthFt}' × ${plotDepthFt}'!`);
  };

  const handleQuickDownloadPng = async () => {
    if (!currentOption) return;
    try {
      await downloadFloorPlanPng(currentOption, {
        projectName: project?.title,
        clientName: project?.clientName
      });
      showNotification(`High-Resolution Blueprint Image (.PNG) downloaded!`);
    } catch {
      handleQuickDownloadSvg();
    }
  };

  const handleQuickDownloadJson = () => {
    if (!currentOption) return;
    downloadFloorPlanSpecificationJson(currentOption);
    showNotification(`Architectural Schedule & Vastu Specification (.JSON) downloaded!`);
  };

  const handleQuickExtractCad = (ext: CadFileExtension) => {
    if (!currentOption) return;
    try {
      downloadCadFile(ext, currentOption, {
        projectName: project?.title,
        clientName: project?.clientName
      });
      showNotification(`Architectural CAD Model (.${ext.toUpperCase()}) extracted successfully!`);
    } catch (err) {
      console.error('CAD export failed:', err);
      showNotification(`Failed to export .${ext.toUpperCase()}`);
    }
  };

  const handleQuickDownloadAllZip = async () => {
    if (!currentOption) return;
    try {
      const zipBlob = await generateCadZipBundle(currentOption, {
        projectName: project?.title,
        clientName: project?.clientName
      });
      const baseName = `VASTU-${plotWidthFt}x${plotDepthFt}-${currentOption.totalBuiltUpSqFt}SQFT-OPT${currentOption.optionNumber}`;
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${baseName}-CAD-EXTRACTION-PACK.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      showNotification(`Complete CAD Package (.ZIP with .DWG, .DXF, .STEP, .STL & Specs) downloaded!`);
    } catch (err) {
      console.error('CAD ZIP export failed:', err);
      showNotification('Failed to generate CAD ZIP package');
    }
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
        <div className="px-6 py-4 bg-slate-900 text-white flex items-center justify-between shrink-0 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center border border-slate-700 text-sky-400">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-bold tracking-tight">
                  Vastu Layout Optimizer &amp; CAD Solids
                </h2>
                <span aria-hidden="true" className="text-slate-500">·</span>
                <span className="text-xs text-slate-300 font-medium">
                  {plotWidthFt}' × {plotDepthFt}' ({areaSqFt.toLocaleString()} sq.ft)
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Generate 3 Vastu-compliant layout options with room breakdown, dimensions &amp; cardinal zoning.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              title="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Input Parameters Control Strip */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 shrink-0">
          <form onSubmit={(e) => { e.preventDefault(); fetchLayouts(); }} className="space-y-3 text-xs">
            {/* Row 1: Plot Presets & Live Auto-Sync Status */}
            <div className="flex flex-wrap items-center justify-between gap-2 bg-white px-3 py-2 rounded-xl border border-slate-200/80 shadow-2xs">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1">
                  <Ruler className="w-3.5 h-3.5 text-[#0f6cbd]" />
                  <span>Standard Plot Presets:</span>
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {QUICK_PRESETS.map(p => (
                    <button
                      key={p.area}
                      type="button"
                      onClick={() => handleSelectPreset(p.area, p.width, p.depth)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 border ${
                        areaSqFt === p.area && plotWidthFt === p.width && plotDepthFt === p.depth
                          ? 'bg-[#002050] text-white border-[#002050] shadow-xs'
                          : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'
                      }`}
                    >
                      <span>{p.label}</span>
                      {p.popular && (
                        <span className="px-1 py-0.2 rounded text-[9px] bg-amber-400 text-slate-950 font-bold uppercase">
                          Popular
                        </span>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Auto-Sync Toggle */}
                <button
                  type="button"
                  onClick={() => setAutoSyncEnabled(!autoSyncEnabled)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition cursor-pointer flex items-center gap-1 border ${
                    autoSyncEnabled 
                      ? 'bg-blue-50 text-blue-800 border-blue-300' 
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}
                  title="When enabled, changing size or specifications instantly recalculates the visualization"
                >
                  <Zap className={`w-3.5 h-3.5 ${autoSyncEnabled ? 'text-amber-500 fill-amber-400' : 'text-slate-400'}`} />
                  <span>Live Sync: {autoSyncEnabled ? 'ON' : 'OFF'}</span>
                </button>

                <div className="text-[11px] text-slate-500 font-mono flex items-center gap-2">
                  <span>Selected Plot:</span>
                  <span className="font-bold text-[#0f6cbd] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                    {plotWidthFt}' × {plotDepthFt}' = {areaSqFt.toLocaleString()} sq.ft
                  </span>
                </div>
              </div>
            </div>

            {/* Row 2: Grid of Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 items-end">
              {/* 1. Plot Size (sq.ft) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Plot Size / Area *
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="300"
                    max="50000"
                    step="25"
                    value={areaSqFt}
                    onChange={e => handleAreaChange(Number(e.target.value) || 0)}
                    className="w-full pl-3 pr-12 py-2 rounded-lg border border-slate-300 font-mono font-bold text-sm text-slate-900 bg-white focus:ring-2 focus:ring-[#0f6cbd] focus:border-[#0f6cbd]"
                    placeholder="e.g. 1200"
                    required
                  />
                  <span className="absolute right-2.5 top-2.5 text-xs text-slate-400 font-semibold">sq.ft</span>
                </div>
              </div>

              {/* 2. Plot Dimensions (Width x Depth) */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Plot Width × Depth (ft)
                </label>
                <div className="flex items-center gap-1.5">
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="15"
                      max="300"
                      value={plotWidthFt}
                      onChange={e => handleDimensionsChange(Number(e.target.value) || 1, plotDepthFt)}
                      className="w-full px-2 py-2 rounded-lg border border-slate-300 font-mono font-bold text-xs text-slate-900 bg-white focus:ring-2 focus:ring-[#0f6cbd]"
                      placeholder="W"
                      title="Plot Width in Feet"
                    />
                    <span className="absolute right-1.5 top-2.5 text-[10px] text-slate-400 font-mono">W</span>
                  </div>
                  <span className="text-slate-400 font-bold">×</span>
                  <div className="relative flex-1">
                    <input
                      type="number"
                      min="15"
                      max="300"
                      value={plotDepthFt}
                      onChange={e => handleDimensionsChange(plotWidthFt, Number(e.target.value) || 1)}
                      className="w-full px-2 py-2 rounded-lg border border-slate-300 font-mono font-bold text-xs text-slate-900 bg-white focus:ring-2 focus:ring-[#0f6cbd]"
                      placeholder="D"
                      title="Plot Depth in Feet"
                    />
                    <span className="absolute right-1.5 top-2.5 text-[10px] text-slate-400 font-mono">D</span>
                  </div>
                </div>
              </div>

              {/* 3. Property Type */}
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
              </div>

              {/* 4. Facing Direction */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Plot / Entrance Facing
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
              </div>

              {/* 5. Number of Floors */}
              <div>
                <label className="block text-[11px] font-bold text-slate-700 mb-1">
                  Number of Floors
                </label>
                <div className="grid grid-cols-3 gap-1">
                  {[1, 2, 3].map(fl => (
                    <button
                      key={fl}
                      type="button"
                      onClick={() => setFloorsCount(fl)}
                      className={`py-2 rounded-lg text-xs font-bold border transition cursor-pointer text-center ${
                        floorsCount === fl
                          ? 'bg-[#002050] text-white border-[#002050]'
                          : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
                      }`}
                    >
                      {fl === 1 ? '1 Flr' : fl === 2 ? 'G+1' : 'G+2'}
                    </button>
                  ))}
                </div>
              </div>

              {/* 6. Generate Button */}
              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2 px-3 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-xs flex items-center justify-center gap-2 transition disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <>
                      <Compass className="w-4 h-4 animate-spin text-sky-400" />
                      <span>Generating Plans...</span>
                    </>
                  ) : (
                    <>
                      <Compass className="w-4 h-4 text-sky-400" />
                      <span>Regenerate Plans</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Row 3: Custom Lifestyle / Vastu Notes */}
            <div className="flex items-center gap-2 pt-0.5">
              <span className="text-[11px] font-semibold text-slate-500 shrink-0">
                Special Vastu / Lifestyle Requirements:
              </span>
              <input
                type="text"
                value={lifestyleNotes}
                onChange={e => setLifestyleNotes(e.target.value)}
                placeholder="e.g. Dedicated Mandir in Ishanya, East cooking in Agni, heavy master suite in Nairutya, 2 covered car parks, open central Brahmasthan"
                className="flex-1 px-3 py-1.5 rounded-lg border border-slate-300 bg-white text-xs text-slate-800 placeholder-slate-400 focus:ring-1 focus:ring-[#0f6cbd]"
              />
            </div>
          </form>
        </div>

        {/* Live Auto-Recalculation Bar */}
        {isUpdatingLive && (
          <div className="bg-slate-900 text-white px-4 py-2 flex items-center justify-between text-xs border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-sky-400 animate-spin" />
              <span className="font-medium text-slate-200">Updating architectural visualization for:</span>
              <span className="font-mono text-white font-semibold bg-slate-800 px-2 py-0.5 rounded">
                {plotWidthFt}' × {plotDepthFt}' ({areaSqFt.toLocaleString()} sq.ft) · {facingDirection} Facing
              </span>
            </div>
            <span className="text-[11px] text-slate-400">Recalculating...</span>
          </div>
        )}

        {/* Toast Notification */}
        {toastMsg && (
          <div className="p-3 bg-emerald-50 border-b border-emerald-200 text-xs text-emerald-800 flex items-center justify-between">
            <div className="flex items-center gap-2 font-medium">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>{toastMsg}</span>
            </div>
            <button onClick={() => setToastMsg(null)} className="text-emerald-700 hover:text-emerald-900">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="p-3 bg-rose-50 border-b border-rose-200 text-xs text-rose-800 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Modal Main Content */}
        <div className="flex-1 overflow-y-auto min-h-0 p-4 sm:p-5 space-y-4">
          {loading && !response && (
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

          {response && (
            <>
              {/* Option Selector Tabs & Fresh File Download Buttons */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-b border-slate-200 pb-3 flex-wrap">
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
                    <div className="flex items-center justify-between mb-2 flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-[#0f6cbd]" />
                        <span className="text-xs font-bold text-slate-900">
                          Key Architectural Room Dimensions ({currentOption.configuration})
                        </span>
                      </div>

                      {/* Fresh File Action Bar */}
                      <div className="flex items-center gap-1.5 flex-wrap">
                        {/* Quick CAD Export Group */}
                        <div className="flex items-center bg-slate-200/80 rounded-lg p-0.5 border border-slate-300">
                          <button
                            onClick={() => handleQuickExtractCad('dwg')}
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-100 hover:bg-amber-200 text-amber-900 transition cursor-pointer"
                            title="Extract AutoCAD Drawing Database (.DWG)"
                          >
                            .DWG
                          </button>
                          <button
                            onClick={() => handleQuickExtractCad('dxf')}
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-100 hover:bg-cyan-200 text-cyan-900 transition cursor-pointer"
                            title="Extract AutoCAD Drawing Exchange (.DXF)"
                          >
                            .DXF
                          </button>
                          <button
                            onClick={() => handleQuickExtractCad('step')}
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-100 hover:bg-emerald-200 text-emerald-900 transition cursor-pointer"
                            title="Extract 3D Solid Model (.STEP)"
                          >
                            .STEP
                          </button>
                          <button
                            onClick={() => handleQuickExtractCad('stl')}
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-100 hover:bg-purple-200 text-purple-900 transition cursor-pointer"
                            title="Extract 3D Stereolithography Mesh (.STL)"
                          >
                            .STL
                          </button>
                          <button
                            onClick={handleQuickDownloadAllZip}
                            className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-100 hover:bg-rose-200 text-rose-900 transition cursor-pointer flex items-center gap-0.5"
                            title="Download All 4 Formats (.ZIP)"
                          >
                            <PackageCheck className="w-2.5 h-2.5" />
                            <span>.ZIP</span>
                          </button>
                        </div>

                        <button
                          onClick={handleQuickDownloadSvg}
                          className="px-2 py-1 rounded bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer"
                          title="Download Vector CAD Blueprint (.SVG)"
                        >
                          <Download className="w-3 h-3 text-blue-600" />
                          <span>.SVG</span>
                        </button>
                        <button
                          onClick={handleQuickDownloadPng}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer"
                          title="Download PNG Blueprint Sheet"
                        >
                          <FileImage className="w-3 h-3 text-slate-600" />
                          <span>.PNG</span>
                        </button>
                        <button
                          onClick={handleQuickDownloadJson}
                          className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 font-semibold text-[11px] flex items-center gap-1 transition cursor-pointer"
                          title="Download Specification Data (.JSON)"
                        >
                          <FileCode className="w-3 h-3 text-slate-600" />
                          <span>.JSON</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('options')}
                          className="text-xs text-[#0f6cbd] font-semibold hover:underline flex items-center gap-1 cursor-pointer ml-1"
                        >
                          <span>Full Schedule &rarr;</span>
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-2">
                      {currentOption.rooms.slice(0, 6).map((r, i) => (
                        <div key={i} className="bg-white p-2 rounded-lg border border-slate-200 text-[11px]">
                          <div className="font-semibold text-slate-900 truncate" title={r.name}>{r.name}</div>
                          <div className="font-mono text-[#0f6cbd] font-bold text-xs mt-0.5">
                            {r.lengthFt}' × {r.widthFt}'
                          </div>
                          <div className="text-[10px] text-slate-500 mt-0.5 flex items-center justify-between">
                            <span>{r.carpetAreaSqFt} sq.ft</span>
                            <span className="text-amber-600 font-medium">{r.vastuDirection.split(' ')[0]}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Room Schedule & Dimensions Tab */}
              {currentOption && activeTab === 'options' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <h4 className="font-bold text-sm text-slate-900">{currentOption.title}</h4>
                      <p className="text-xs text-slate-500">
                        {currentOption.configuration} • {currentOption.totalBuiltUpSqFt} sq.ft Built-Up • {currentOption.totalCarpetSqFt} sq.ft Carpet ({currentOption.carpetRatioPercent}%)
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleQuickDownloadJson}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-xs"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Schedule (.JSON)</span>
                      </button>
                    </div>
                  </div>

                  <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 text-slate-700 font-bold uppercase text-[10px] tracking-wider border-b border-slate-200">
                        <tr>
                          <th className="py-2.5 px-3">#</th>
                          <th className="py-2.5 px-3">Room / Space</th>
                          <th className="py-2.5 px-3">Zone &amp; Floor</th>
                          <th className="py-2.5 px-3 font-mono text-right">Length × Width</th>
                          <th className="py-2.5 px-3 font-mono text-right">Carpet Area</th>
                          <th className="py-2.5 px-3">Vastu Direction</th>
                          <th className="py-2.5 px-3">Vastu Element</th>
                          <th className="py-2.5 px-3">Vastu Significance</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {currentOption.rooms.map((r, idx) => {
                          const badge = getDirectionBadge(r.vastuDirection);
                          const BadgeIcon = badge.icon;
                          return (
                            <tr key={idx} className="hover:bg-slate-50 transition">
                              <td className="py-2.5 px-3 font-mono text-slate-400 font-bold">{idx + 1}</td>
                              <td className="py-2.5 px-3 font-bold text-slate-900">{r.name}</td>
                              <td className="py-2.5 px-3 text-slate-500">{r.zone} ({r.floor})</td>
                              <td className="py-2.5 px-3 font-mono font-bold text-[#0f6cbd] text-right whitespace-nowrap">
                                {r.lengthFt}' × {r.widthFt}'
                              </td>
                              <td className="py-2.5 px-3 font-mono font-bold text-slate-900 text-right whitespace-nowrap">
                                {r.carpetAreaSqFt} sq.ft
                              </td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border flex items-center gap-1 w-fit ${badge.bg}`}>
                                  <BadgeIcon className="w-3 h-3" />
                                  <span>{r.vastuDirection}</span>
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 font-medium">{r.vastuElement}</td>
                              <td className="py-2.5 px-3 text-slate-500 max-w-xs">{r.vastuSignificance}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 9-Grid Vastu Matrix Tab */}
              {activeTab === 'mandala' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                      <Compass className="w-4 h-4 text-[#0f6cbd]" />
                      <span>9-Grid Vastu Purusha Mandala Directional Matrix</span>
                    </h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Elemental zoning, presiding deities, and recommended room allocations calibrated for {facingDirection} facing {propertyType.replace('_', ' ')}.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {response.vastuCompassGuidelines.map((g, idx) => (
                      <div key={idx} className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-2xs space-y-2">
                        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                          <span className="font-bold text-xs text-slate-900">{g.direction}</span>
                          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                            {g.element}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-600">
                          <span className="font-semibold text-slate-700">Presiding Deity: </span>
                          <span>{g.deity}</span>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">Recommended:</div>
                          <div className="text-[11px] text-slate-700 flex flex-wrap gap-1 mt-1">
                            {g.recommendedRooms.map((rm, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px]">
                                {rm}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div>
                          <div className="text-[10px] font-bold text-rose-700 uppercase tracking-wider">Strictly Avoid:</div>
                          <div className="text-[11px] text-slate-700 flex flex-wrap gap-1 mt-1">
                            {g.strictlyAvoid.map((av, i) => (
                              <span key={i} className="px-1.5 py-0.5 rounded bg-rose-50 text-rose-800 border border-rose-200 text-[10px]">
                                {av}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Vastu Principles Guidelines Tab */}
              {activeTab === 'guidelines' && (
                <div className="space-y-4 text-xs text-slate-700 bg-white p-5 rounded-xl border border-slate-200">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#0f6cbd]" />
                    <span>Vastu Shastra Architectural Principles for Turnkey Construction</span>
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    <div className="p-3.5 rounded-xl bg-blue-50/60 border border-blue-200 space-y-1.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Droplets className="w-4 h-4 text-cyan-600" />
                        <span>1. Ishanya (North-East) Purity Rule</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        North-East is the sacred point of cosmic inflow. Keep it lightweight, open, and elevated with pure water elements or Pooja mandirs. Never place heavy loads, toilets, septic tanks, or cooking fire in Ishanya.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-amber-50/60 border border-amber-200 space-y-1.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Flame className="w-4 h-4 text-amber-600" />
                        <span>2. Agni (South-East) Fire Zone Rule</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        South-East governs the fire element (Agni). The cooking hob must be situated such that the chef faces East while preparing food, ensuring optimal vitality, positive bio-energy, and digestion.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-emerald-50/60 border border-emerald-200 space-y-1.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Mountain className="w-4 h-4 text-emerald-600" />
                        <span>3. Nairutya (South-West) Heavy Anchor Rule</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        South-West is the Earth quadrant (Prithvi) commanding stability and leadership. The master bedroom suite, head of family, heavy wardrobes, and highest roof terraces belong here.
                      </p>
                    </div>

                    <div className="p-3.5 rounded-xl bg-purple-50/60 border border-purple-200 space-y-1.5">
                      <div className="font-bold text-slate-900 flex items-center gap-1.5">
                        <Sun className="w-4 h-4 text-purple-600" />
                        <span>4. Brahmasthan (Center) Open Core Rule</span>
                      </div>
                      <p className="text-slate-600 text-[11px] leading-relaxed">
                        The central 1/9th zone is governed by Lord Brahma (Space element). It must remain completely free of structural columns, staircases, toilets, and heavy load-bearing shear walls.
                      </p>
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
