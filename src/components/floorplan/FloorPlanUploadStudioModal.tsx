import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  X,
  CheckCircle2,
  AlertCircle,
  Layers,
  Ruler,
  Compass,
  Palette,
  DollarSign,
  Maximize2,
  Download,
  Eye,
  RefreshCw,
  Sliders,
  ArrowRight,
  ChevronRight,
  FileCheck,
  Check,
  Camera,
  Sun,
  ShieldCheck,
  HelpCircle,
  ExternalLink,
  Flame,
  Info
} from 'lucide-react';
import {
  InteriorSpecificationInput,
  InteriorDesignOption,
  ConceptMaterialItem
} from '../../types/floorplanSpatial';

interface FloorPlanUploadStudioModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplyOptionToStudio: (option: InteriorDesignOption, specs: InteriorSpecificationInput, generatedImageUrl: string) => void;
  initialRoomName?: string;
  initialDimensions?: { lengthFt: number; widthFt: number; heightFt?: number };
}

// Pre-packaged floor plan templates for quick instant testing
const SAMPLE_FLOOR_PLANS = [
  {
    id: 'VILLA_253_CAD',
    name: 'Villa 253 - 3BHK North-Facing CAD Plan',
    roomType: 'LIVING_DINING',
    roomName: 'Living & Dining Great Room',
    lengthFt: 25.33,
    widthFt: 19.0,
    heightFt: 10.25,
    facingDirection: 'NORTH' as const,
    style: 'WARM_LUXURY',
    furniture: ['Low-slung 6-seat modular bouclé sectional', '8-seater solid wood dining table', '12ft floating travertine media console', '27ft sliding glass doors to deck'],
    materials: ['Italian silver vein-cut travertine', 'Fluted teakwood acoustic wall cladding', 'Brushed champagne brass trims', 'Low-E aluminum sliders (SD1)'],
    lighting: '2700K indirect perimeter ceiling coves + magnetic brass linear dining chandelier',
    previewUrl: '/assets/images/villa253_living_greatroom_1790833681710.jpg'
  },
  {
    id: 'VILLA_253_MBR',
    name: 'Villa 253 - Master Bedroom Suite 1',
    roomType: 'MASTER_BEDROOM',
    roomName: 'Master Bedroom Suite 1',
    lengthFt: 14.0,
    widthFt: 19.0,
    heightFt: 10.25,
    facingDirection: 'NORTH_EAST' as const,
    style: 'WARM_LUXURY',
    furniture: ['King platform bed with fluted oak headboard', 'Concealed tinted glass sliding wardrobe (SD7)', 'Private terrace slider (SD4)', 'Floating bedside tables with Qi wireless'],
    materials: ['Fluted American white oak paneling', 'Tinted smoked fluted glass', 'Engineered smoked oak parquet', 'Cashmere-blend soft bouclé'],
    lighting: 'Warm 2700K hidden headboard cove wash + glare-free 15° brass reading spots',
    previewUrl: '/assets/images/villa253_master_suite_1790833696550.jpg'
  },
  {
    id: 'SKYLINE_2BHK',
    name: 'Skyline Penthouse - Open Living & Balcony',
    roomType: 'LIVING_DINING',
    roomName: 'Penthouse Great Lounge',
    lengthFt: 22.0,
    widthFt: 16.5,
    heightFt: 11.0,
    facingDirection: 'EAST' as const,
    style: 'ITALIAN_MONOLITHIC',
    furniture: ['L-shaped charcoal Italian leather sofa', 'Calacatta marble waterfall dining island', 'Recessed ceiling track lighting', 'Full height glass slider'],
    materials: ['Calacatta Gold quartzite', 'Matte charcoal Fenix anti-fingerprint cabinetry', 'Polished warm concrete floor', 'Smoked bronze fixtures'],
    lighting: '25mm trimless magnetic track lights + under-counter LED float',
    previewUrl: '/assets/images/villa253_living_modern_1790830799942.jpg'
  }
];

export const FloorPlanUploadStudioModal: React.FC<FloorPlanUploadStudioModalProps> = ({
  isOpen,
  onClose,
  onApplyOptionToStudio,
  initialRoomName = 'Living & Dining Great Room',
  initialDimensions = { lengthFt: 25.33, widthFt: 19.0, heightFt: 10.25 }
}) => {
  // Wizard Steps: 1 = Upload & Room, 2 = Specifications & Style, 3 = Options & System Render
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form State
  const [floorPlanImageBase64, setFloorPlanImageBase64] = useState<string | null>(null);
  const [floorPlanFileName, setFloorPlanFileName] = useState<string>('');
  const [roomType, setRoomType] = useState<string>('LIVING_DINING');
  const [roomName, setRoomName] = useState<string>(initialRoomName);
  const [lengthFt, setLengthFt] = useState<number>(initialDimensions.lengthFt);
  const [widthFt, setWidthFt] = useState<number>(initialDimensions.widthFt);
  const [ceilingHeightFt, setCeilingHeightFt] = useState<number>(initialDimensions.heightFt || 10.0);
  const [facingDirection, setFacingDirection] = useState<'NORTH' | 'SOUTH' | 'EAST' | 'WEST' | 'NORTH_EAST'>('NORTH');
  const [budgetTier, setBudgetTier] = useState<'BUDGET_CONTEMPORARY' | 'PREMIUM_LUXURY' | 'BESPOKE_ULTRA_LUXURY'>('PREMIUM_LUXURY');
  const [preferredStyle, setPreferredStyle] = useState<string>('WARM_LUXURY');
  const [customStylePrompt, setCustomStylePrompt] = useState<string>('');
  const [furnitureInput, setFurnitureInput] = useState<string>('Modular bouclé sectional, 8-seater dining table, floating media console, floor-to-ceiling glass slider');
  const [materialsInput, setMaterialsInput] = useState<string>('Vein-cut travertine floor, fluted teakwood wall cladding, brushed brass trim, natural linen');
  const [lightingInput, setLightingInput] = useState<string>('2700K indirect perimeter ceiling coves, magnetic brass pendant, natural window daylight');
  const [specialNotes, setSpecialNotes] = useState<string>('Must connect seamlessly with outdoor deck; avoid glare on TV screen; keep 4ft clear circulation to kitchen.');

  // AI Options Generation State
  const [isGeneratingOptions, setIsGeneratingOptions] = useState<boolean>(false);
  const [generatedOptions, setGeneratedOptions] = useState<InteriorDesignOption[]>([]);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);

  // Render Generation State
  const [isGeneratingRender, setIsGeneratingRender] = useState<boolean>(false);
  const [activeRenderUrl, setActiveRenderUrl] = useState<string | null>(null);
  const [renderMeta, setRenderMeta] = useState<{ isRealAi: boolean; summary: string } | null>(null);
  const [compareMode, setCompareMode] = useState<'RENDER_ONLY' | 'SIDE_BY_SIDE'>('SIDE_BY_SIDE');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Reset or initialize
  useEffect(() => {
    if (isOpen && !floorPlanImageBase64) {
      // Default to Villa 253 sample CAD
      loadSample(SAMPLE_FLOOR_PLANS[0]);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFloorPlanFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setFloorPlanImageBase64(result);
    };
    reader.readAsDataURL(file);
  };

  const loadSample = (sample: typeof SAMPLE_FLOOR_PLANS[0]) => {
    setFloorPlanFileName(sample.name);
    setRoomType(sample.roomType);
    setRoomName(sample.roomName);
    setLengthFt(sample.lengthFt);
    setWidthFt(sample.widthFt);
    setCeilingHeightFt(sample.heightFt);
    setFacingDirection(sample.facingDirection);
    setPreferredStyle(sample.style);
    setFurnitureInput(sample.furniture.join(', '));
    setMaterialsInput(sample.materials.join(', '));
    setLightingInput(sample.lighting);
    setFloorPlanImageBase64(sample.previewUrl);
  };

  const getSpecsPayload = (): InteriorSpecificationInput => ({
    floorPlanImageBase64: floorPlanImageBase64 || undefined,
    floorPlanFileName: floorPlanFileName || 'Custom Floor Plan',
    roomType,
    roomName,
    lengthFt: Number(lengthFt) || 20,
    widthFt: Number(widthFt) || 15,
    ceilingHeightFt: Number(ceilingHeightFt) || 10,
    preferredStyle,
    customStylePrompt: customStylePrompt.trim() || undefined,
    keyFurnitureRequirements: furnitureInput.split(',').map(s => s.trim()).filter(Boolean),
    materialPreferences: materialsInput.split(',').map(s => s.trim()).filter(Boolean),
    lightingPreference: lightingInput,
    budgetTier,
    facingDirection,
    specialNotes
  });

  // Step 2 -> 3: Request AI Analysis & Best Options
  const handleGenerateOptions = async () => {
    setIsGeneratingOptions(true);
    setErrorMsg(null);
    setCurrentStep(3);

    const payload = getSpecsPayload();

    try {
      const res = await fetch('/api/ai/floorplan-interior-options', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to analyze floor plan.');
      }

      const options: InteriorDesignOption[] = await res.json();
      setGeneratedOptions(options);

      if (options.length > 0) {
        setSelectedOptionId(options[0].id);
        // Automatically trigger in-system render generation for the recommended option!
        handleGenerateRender(options[0], payload);
      }
    } catch (err: any) {
      console.error('Error generating interior options:', err);
      setErrorMsg(err.message || 'Failed to generate interior options. Please check network.');
    } finally {
      setIsGeneratingOptions(false);
    }
  };

  // Generate In-System Render for Selected Option
  const handleGenerateRender = async (option: InteriorDesignOption, overrideSpecs?: InteriorSpecificationInput) => {
    setIsGeneratingRender(true);
    setErrorMsg(null);

    const specs = overrideSpecs || getSpecsPayload();

    try {
      const res = await fetch('/api/ai/generate-interior-render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ specs, selectedOption: option })
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to generate render.');
      }

      const result = await res.json();
      setActiveRenderUrl(result.imageUrl);
      setRenderMeta({
        isRealAi: result.isRealAiGenerated,
        summary: result.generationSummary
      });

      // Update option object with generated image
      setGeneratedOptions(prev => prev.map(o => o.id === option.id ? { ...o, generatedRenderUrl: result.imageUrl } : o));
    } catch (err: any) {
      console.error('Error synthesizing render:', err);
      setErrorMsg(err.message || 'Failed to synthesize render.');
    } finally {
      setIsGeneratingRender(false);
    }
  };

  const selectedOption = generatedOptions.find(o => o.id === selectedOptionId) || generatedOptions[0];

  const handleApplyToStudio = () => {
    if (!selectedOption || !activeRenderUrl) return;
    onApplyOptionToStudio(selectedOption, getSpecsPayload(), activeRenderUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[94vh] flex flex-col border border-slate-200 overflow-hidden text-slate-800 animate-in fade-in zoom-in-95 duration-200">
        
        {/* MODAL HEADER */}
        <div className="px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Floor Plan Upload & Autonomous Interior Studio</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  SYSTEM GENERATED RENDERS ONLY
                </span>
              </div>
              <p className="text-xs text-slate-300">
                Upload floor plan • Define specifications • Generate optimal interior options • Self-synthesizes high-res 3D render every time
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="p-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/10 transition"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* STEP PROGRESS WIZARD BAR */}
        <div className="bg-slate-50 border-b border-slate-200 px-6 py-2.5 flex items-center justify-between text-xs shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setCurrentStep(1)}
              className={`flex items-center gap-2 font-medium transition ${
                currentStep === 1 ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>1</span>
              <span>1. Upload Floor Plan & Room Dimensions</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300" />

            <button
              onClick={() => setCurrentStep(2)}
              className={`flex items-center gap-2 font-medium transition ${
                currentStep === 2 ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>2</span>
              <span>2. Add Interior Specifications & Style</span>
            </button>

            <ChevronRight className="w-4 h-4 text-slate-300" />

            <button
              onClick={() => {
                if (generatedOptions.length > 0) setCurrentStep(3);
                else handleGenerateOptions();
              }}
              className={`flex items-center gap-2 font-medium transition ${
                currentStep === 3 ? 'text-indigo-600 font-bold' : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                currentStep === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>3</span>
              <span>3. Best Interior Options & Dynamic 3D Render</span>
            </button>
          </div>

          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>100% In-System Generative Engine • Zero External Image Scrapes</span>
          </div>
        </div>

        {/* MODAL BODY CONTAINER */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2.5 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: UPLOAD FLOOR PLAN & ROOM SETUP */}
          {currentStep === 1 && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Upload Dropzone & Sample Picker */}
              <div className="lg:col-span-6 space-y-4">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Upload className="w-4 h-4 text-indigo-600" />
                    <span>Upload 2D Floor Plan (CAD / PDF / Image)</span>
                  </label>
                  <span className="text-[11px] text-slate-500">PNG, JPG, SVG, WebP up to 25MB</span>
                </div>

                {/* Upload Dropzone */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="border-2 border-dashed border-indigo-200 hover:border-indigo-400 bg-indigo-50/40 hover:bg-indigo-50/70 rounded-2xl p-6 text-center cursor-pointer transition flex flex-col items-center justify-center min-h-[220px]"
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*,.pdf,.svg"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <div className="w-12 h-12 rounded-xl bg-white shadow-sm border border-indigo-100 flex items-center justify-center text-indigo-600 mb-3">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-800">
                    Click to browse or drag & drop floor plan
                  </p>
                  <p className="text-xs text-slate-500 mt-1 max-w-sm">
                    Upload architectural drawings, scanned hand sketches, or CAD layouts. The AI extracts dimensions, window portals, and circulation clearances.
                  </p>
                  {floorPlanFileName && (
                    <div className="mt-3 px-3 py-1 bg-white border border-indigo-200 rounded-full text-xs font-semibold text-indigo-700 flex items-center gap-1.5 shadow-sm">
                      <FileCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{floorPlanFileName}</span>
                    </div>
                  )}
                </div>

                {/* Quick Pre-loaded Samples */}
                <div>
                  <div className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                    Or select pre-calibrated architectural sample:
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {SAMPLE_FLOOR_PLANS.map(sample => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => loadSample(sample)}
                        className={`text-left p-2.5 rounded-xl border text-xs transition ${
                          floorPlanFileName === sample.name
                            ? 'border-indigo-600 bg-indigo-50/60 font-semibold text-indigo-900 shadow-sm'
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        <div className="font-bold truncate">{sample.name.split('-')[0]}</div>
                        <div className="text-[11px] text-slate-500">{sample.lengthFt}' × {sample.widthFt}'</div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Room Space & Dimensional Parameters */}
              <div className="lg:col-span-6 space-y-4 bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Ruler className="w-4 h-4 text-indigo-600" />
                  <span>Target Room Space & Measured Geometry</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Room Classification</label>
                    <select
                      value={roomType}
                      onChange={e => setRoomType(e.target.value)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="LIVING_DINING">Living & Dining Great Room</option>
                      <option value="MASTER_BEDROOM">Master Bedroom Suite</option>
                      <option value="GUEST_BEDROOM">Guest Bedroom / Study</option>
                      <option value="KITCHEN_PANTRY">Open Island Kitchen & Pantry</option>
                      <option value="BALCONY_GAZEBO">Roof Gazebo / Terrace Veranda</option>
                      <option value="PENTHOUSE_LOUNGE">Full Penthouse Suite</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Display Label</label>
                    <input
                      type="text"
                      value={roomName}
                      onChange={e => setRoomName(e.target.value)}
                      placeholder="e.g. Living & Dining Great Room"
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none font-semibold"
                    />
                  </div>
                </div>

                {/* Dimensions: Length x Width x Height */}
                <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-3">
                  <div className="text-[11px] font-bold text-slate-700 uppercase flex items-center justify-between">
                    <span>Verified Physical Dimensions</span>
                    <span className="text-indigo-600 font-bold">
                      {Math.round(lengthFt * widthFt)} sq.ft carpet area
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-1">Length (Feet)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={lengthFt}
                        onChange={e => setLengthFt(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-1">Width (Feet)</span>
                      <input
                        type="number"
                        step="0.1"
                        value={widthFt}
                        onChange={e => setWidthFt(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md font-mono"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block mb-1">Ceiling Height</span>
                      <input
                        type="number"
                        step="0.1"
                        value={ceilingHeightFt}
                        onChange={e => setCeilingHeightFt(parseFloat(e.target.value) || 0)}
                        className="w-full text-xs px-2.5 py-1.5 border border-slate-300 rounded-md font-mono"
                      />
                    </div>
                  </div>
                </div>

                {/* Facing Orientation & Vastu */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Facing Orientation</label>
                    <select
                      value={facingDirection}
                      onChange={e => setFacingDirection(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="NORTH">North (Cool ambient daylight, Vastu Kuber)</option>
                      <option value="EAST">East (Warm morning sunlight, Vastu Ishanya)</option>
                      <option value="NORTH_EAST">North-East (Optimal spiritual clarity & light)</option>
                      <option value="SOUTH">South (Direct strong sun, requires deep shading)</option>
                      <option value="WEST">West (Golden afternoon light, thermal insulation)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-600 block mb-1">Budget Standard</label>
                    <select
                      value={budgetTier}
                      onChange={e => setBudgetTier(e.target.value as any)}
                      className="w-full text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    >
                      <option value="PREMIUM_LUXURY">Premium Luxury (₹2,800 - ₹3,600 / sq.ft)</option>
                      <option value="BESPOKE_ULTRA_LUXURY">Bespoke High-End (₹3,800 - ₹5,200 / sq.ft)</option>
                      <option value="BUDGET_CONTEMPORARY">Contemporary Modern (₹2,100 - ₹2,600 / sq.ft)</option>
                    </select>
                  </div>
                </div>

                {/* Continue CTA */}
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-2 shadow-sm"
                  >
                    <span>Proceed to Step 2: Interior Specifications</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: DETAILED SPECIFICATIONS & PREFERRED STYLE */}
          {currentStep === 2 && (
            <div className="space-y-6">
              
              {/* Style Presets Grid */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
                  <Palette className="w-4 h-4 text-indigo-600" />
                  <span>Choose Primary Interior Style Archetype</span>
                </label>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    {
                      id: 'WARM_LUXURY',
                      title: 'Warm Luxury Contemporary',
                      desc: 'Vein-cut travertine, fluted teak slats, champagne brass, 2700K ambient coves',
                      badge: 'Top Villa 253 Pick'
                    },
                    {
                      id: 'JAPANDI_ZEN',
                      title: 'Japandi Zen Minimalist',
                      desc: 'Natural white ash, washi paper lanterns, lime plaster, low-profile tatami ledges',
                      badge: 'Calming Acoustic'
                    },
                    {
                      id: 'BIOPHILIC_MODERN',
                      title: 'Biophilic Sunlit Haven',
                      desc: 'Integrated indoor planter courtyard, natural sandstone, skylight wash, curved bouclé',
                      badge: 'Nature-Infused'
                    },
                    {
                      id: 'ITALIAN_MONOLITHIC',
                      title: 'Italian Monolithic Modern',
                      desc: 'Calacatta marble waterfall, matte charcoal Fenix, trimless magnetic tracks',
                      badge: 'Gallery Chic'
                    }
                  ].map(style => (
                    <div
                      key={style.id}
                      onClick={() => setPreferredStyle(style.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition relative ${
                        preferredStyle === style.id
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-sm ring-1 ring-indigo-500'
                          : 'border-slate-200 bg-white hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="font-bold text-xs text-slate-900">{style.title}</span>
                        {preferredStyle === style.id && (
                          <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                        )}
                      </div>
                      <p className="text-[11px] text-slate-600 leading-relaxed mb-2">{style.desc}</p>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-white border border-slate-200 text-slate-600">
                        {style.badge}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Specification Form Inputs */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                
                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Key Furniture & Joinery Specifications
                    </label>
                    <textarea
                      rows={3}
                      value={furnitureInput}
                      onChange={e => setFurnitureInput(e.target.value)}
                      placeholder="e.g. 6-seater bouclé sofa, 8-seater dining table, fluted TV console, floating credenza"
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Comma-separated key functional elements</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Material & Finish Palette Preferences
                    </label>
                    <textarea
                      rows={3}
                      value={materialsInput}
                      onChange={e => setMaterialsInput(e.target.value)}
                      placeholder="e.g. Italian vein-cut travertine slabs, natural teak wood battens, brushed champagne brass"
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Materials will be auto-linked to ERP Master Rates</span>
                  </div>
                </div>

                <div className="space-y-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Lighting & Ambience Strategy
                    </label>
                    <textarea
                      rows={3}
                      value={lightingInput}
                      onChange={e => setLightingInput(e.target.value)}
                      placeholder="e.g. Concealed 2700K perimeter cove strip, magnetic brass linear dining chandelier, low glare spots"
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Specify color temperature (2700K-4000K) and fixture layers</span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Client Constraints & Functional Requirements
                    </label>
                    <textarea
                      rows={3}
                      value={specialNotes}
                      onChange={e => setSpecialNotes(e.target.value)}
                      placeholder="e.g. Maintain 4ft clear passage to deck, pet-friendly bouclé fabric, concealed cables"
                      className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <span className="text-[10px] text-slate-500">Critical circulation & site survey mandates</span>
                  </div>
                </div>
              </div>

              {/* Navigation Actions */}
              <div className="flex items-center justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-4 py-2 border border-slate-300 rounded-xl text-xs font-semibold text-slate-700 hover:bg-slate-100 transition"
                >
                  ← Back to Floor Plan
                </button>

                <button
                  type="button"
                  onClick={handleGenerateOptions}
                  disabled={isGeneratingOptions}
                  className="px-6 py-3 bg-gradient-to-r from-amber-600 via-indigo-600 to-indigo-700 hover:from-amber-700 hover:to-indigo-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                >
                  <Sparkles className="w-4 h-4 text-amber-300 animate-spin" />
                  <span>Generate Best Interior Options & Dynamic 3D Render</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: OPTIONS SHOWCASE & IN-SYSTEM GENERATED RENDER */}
          {currentStep === 3 && (
            <div className="space-y-6">

              {/* Loading State Animation */}
              {isGeneratingOptions && (
                <div className="p-8 text-center bg-indigo-50/50 rounded-2xl border border-indigo-100 space-y-4">
                  <div className="w-14 h-14 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg animate-bounce">
                    <Sparkles className="w-7 h-7 text-amber-300" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-slate-900">
                      Analyzing Floor Plan & Synthesizing Optimal Interior Designs...
                    </h3>
                    <p className="text-xs text-slate-600 max-w-md mx-auto">
                      Evaluating room apertures, 4.2ft circulation clear zones, material acoustics, and daylight orientation for {roomName} ({lengthFt}' × {widthFt}').
                    </p>
                  </div>
                  <div className="flex justify-center gap-2 text-[11px] text-indigo-700 font-medium">
                    <span className="animate-pulse">• Calculating Vastu Harmony</span>
                    <span className="animate-pulse delay-75">• Mapping Travertine & Oak Finishes</span>
                    <span className="animate-pulse delay-150">• Generating Photorealistic 3D Perspective</span>
                  </div>
                </div>
              )}

              {/* Options Selector Strip */}
              {generatedOptions.length > 0 && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                        <span>Generated Options: What Interior Type is Best?</span>
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-700">
                          {generatedOptions.length} Evaluated
                        </span>
                      </h3>
                      <p className="text-xs text-slate-500">
                        Select any option below to view architectural rationale and generate or compare its high-resolution render.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleGenerateOptions}
                      disabled={isGeneratingOptions}
                      className="px-3 py-1.5 rounded-lg border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition flex items-center gap-1.5"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingOptions ? 'animate-spin' : ''}`} />
                      <span>Re-analyze Options</span>
                    </button>
                  </div>

                  {/* Option Cards Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {generatedOptions.map((option, idx) => {
                      const isSelected = option.id === selectedOptionId;
                      return (
                        <div
                          key={option.id}
                          onClick={() => {
                            setSelectedOptionId(option.id);
                            if (option.generatedRenderUrl) {
                              setActiveRenderUrl(option.generatedRenderUrl);
                            } else {
                              handleGenerateRender(option);
                            }
                          }}
                          className={`p-4 rounded-xl border text-left cursor-pointer transition relative flex flex-col justify-between ${
                            isSelected
                              ? 'border-indigo-600 bg-indigo-50/70 shadow-md ring-2 ring-indigo-500'
                              : 'border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300'
                          }`}
                        >
                          {option.isRecommended && (
                            <span className="absolute -top-2.5 left-4 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500 text-white shadow-sm flex items-center gap-1">
                              <Flame className="w-3 h-3" />
                              <span>TOP RECOMMENDED FOR THIS PLAN</span>
                            </span>
                          )}

                          <div className="space-y-2 mt-1">
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-xs font-bold text-slate-900 leading-snug">
                                {option.title}
                              </h4>
                              {isSelected ? (
                                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0" />
                              ) : (
                                <span className="text-[10px] font-mono text-slate-400">Opt {idx + 1}</span>
                              )}
                            </div>

                            <p className="text-[11px] text-slate-600 line-clamp-2">
                              {option.tagline}
                            </p>

                            {/* Color Palette Swatches */}
                            <div className="flex items-center gap-1 pt-1">
                              {option.colorPalette.map((col, i) => (
                                <div
                                  key={i}
                                  className="w-4 h-4 rounded-full border border-black/10"
                                  style={{ backgroundColor: col.hex }}
                                  title={`${col.name} (${col.hex})`}
                                />
                              ))}
                            </div>
                          </div>

                          <div className="mt-3 pt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px]">
                            <span className="font-bold text-indigo-700">
                              ₹{option.estimatedCostPerSqFt}/sq.ft
                            </span>
                            <div className="flex items-center gap-2 text-[10px] text-slate-500">
                              <span>Vastu: <strong className="text-emerald-700">{option.vastuComplianceScore}%</strong></span>
                              <span>Circulation: <strong className="text-blue-700">{option.circulationScore}%</strong></span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* ACTIVE OPTION DETAIL & RENDER CANVAS VIEWPORT */}
              {selectedOption && (
                <div className="bg-slate-900 rounded-2xl border border-slate-800 p-5 text-white space-y-5 shadow-xl">
                  
                  {/* Top Bar of Active Render */}
                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                          {selectedOption.isRecommended ? '★ BEST ARCHITECTURAL MATCH' : 'ALTERNATIVE INTERIOR'}
                        </span>
                        <h3 className="text-base font-bold text-white">
                          {selectedOption.title}
                        </h3>
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {selectedOption.subtitle} • {selectedOption.tagline}
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setCompareMode(compareMode === 'SIDE_BY_SIDE' ? 'RENDER_ONLY' : 'SIDE_BY_SIDE')}
                        className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-300 transition flex items-center gap-1.5"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>{compareMode === 'SIDE_BY_SIDE' ? 'Full Render View' : 'Side-by-Side 2D Plan'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => handleGenerateRender(selectedOption)}
                        disabled={isGeneratingRender}
                        className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition flex items-center gap-1.5 disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3.5 h-3.5 ${isGeneratingRender ? 'animate-spin' : ''}`} />
                        <span>Regenerate Fresh Render</span>
                      </button>
                    </div>
                  </div>

                  {/* Render Visual Canvas / Side-by-Side Viewport */}
                  <div className="space-y-2">
                    <div className={`grid gap-4 ${compareMode === 'SIDE_BY_SIDE' ? 'grid-cols-1 lg:grid-cols-12' : 'grid-cols-1'}`}>
                      
                      {/* Left: Uploaded 2D Floor Plan (In Side-by-Side mode) */}
                      {compareMode === 'SIDE_BY_SIDE' && (
                        <div className="lg:col-span-5 bg-slate-950 rounded-xl border border-slate-800 p-3 flex flex-col justify-between">
                          <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800/80 pb-2 mb-2">
                            <span className="flex items-center gap-1.5">
                              <Compass className="w-3.5 h-3.5 text-indigo-400" />
                              <span>Verified 2D Floor Plan Layout</span>
                            </span>
                            <span className="text-[10px] text-emerald-400 font-mono">100% SCALE LOCKED</span>
                          </div>

                          <div className="flex-1 flex items-center justify-center min-h-[260px] max-h-[360px] bg-slate-900/60 rounded-lg overflow-hidden relative">
                            {floorPlanImageBase64 ? (
                              <img
                                src={floorPlanImageBase64}
                                alt="Uploaded 2D Floor Plan"
                                className="max-h-[340px] w-auto object-contain rounded-md"
                              />
                            ) : (
                              <div className="text-center text-slate-500 text-xs p-6">
                                <Upload className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                                <span>No 2D floor plan uploaded</span>
                              </div>
                            )}

                            {/* Corner Plan Inset Tag */}
                            <div className="absolute bottom-2 left-2 bg-black/80 backdrop-blur-md px-2 py-1 rounded text-[10px] text-slate-300 border border-slate-700">
                              {roomName} ({lengthFt}' × {widthFt}')
                            </div>
                          </div>

                          <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                            <span>Window Orientation: <strong>Facing {facingDirection}</strong></span>
                            <span>Circulation: <strong>{selectedOption.circulationScore}% Clean</strong></span>
                          </div>
                        </div>
                      )}

                      {/* Right: High-Quality In-System Render */}
                      <div className={`${compareMode === 'SIDE_BY_SIDE' ? 'lg:col-span-7' : 'col-span-1'} bg-slate-950 rounded-xl border border-slate-800 p-3 flex flex-col justify-between relative`}>
                        <div className="flex items-center justify-between text-xs font-bold text-slate-300 border-b border-slate-800/80 pb-2 mb-2">
                          <span className="flex items-center gap-1.5">
                            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                            <span>System Generated 3D Architectural Render</span>
                          </span>
                          <span className="text-[10px] text-amber-400 font-semibold flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                            <span>Authentic • Not from Google</span>
                          </span>
                        </div>

                        {/* Image Frame */}
                        <div className="flex-1 flex items-center justify-center min-h-[280px] max-h-[420px] bg-slate-900/60 rounded-lg overflow-hidden relative">
                          {isGeneratingRender ? (
                            <div className="text-center space-y-3 p-8">
                              <RefreshCw className="w-8 h-8 text-amber-400 animate-spin mx-auto" />
                              <p className="text-xs font-bold text-amber-200">
                                Synthesizing High-Detail Architectural Render...
                              </p>
                              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                                Applying vein-cut stone reflections, 2700K ambient coves, fluted timber millwork, and verified 2D layout constraints.
                              </p>
                            </div>
                          ) : activeRenderUrl ? (
                            <img
                              src={activeRenderUrl}
                              alt={selectedOption.title}
                              className="w-full h-full max-h-[420px] object-cover rounded-lg shadow-2xl"
                            />
                          ) : (
                            <div className="text-center text-slate-500 text-xs p-8">
                              <Camera className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                              <span>Click "Regenerate Fresh Render" to synthesize</span>
                            </div>
                          )}

                          {/* Watermark / Provenance Tag */}
                          {activeRenderUrl && !isGeneratingRender && (
                            <div className="absolute top-3 right-3 bg-black/85 backdrop-blur-md px-2.5 py-1 rounded-md text-[10px] text-slate-300 border border-slate-700/80 flex items-center gap-1.5 shadow-lg">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              <span>Build Storys Generative Spatial Synthesizer</span>
                            </div>
                          )}
                        </div>

                        {/* Bottom Actions Bar */}
                        <div className="mt-2.5 flex items-center justify-between text-xs">
                          <div className="text-[11px] text-slate-400">
                            {renderMeta?.summary || `Synthesized for ${selectedOption.title}`}
                          </div>

                          {activeRenderUrl && (
                            <div className="flex items-center gap-2">
                              <a
                                href={activeRenderUrl}
                                download={`BuildStorys_Render_${roomName.replace(/\s+/g, '_')}.jpg`}
                                className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition flex items-center gap-1"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>Download Render</span>
                              </a>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Why this interior type is best for this floor plan */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                    
                    {/* Architectural Rationale */}
                    <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-2">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Why This Interior is Best for This Floor Plan</span>
                      </h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {selectedOption.whyBestForThisFloorPlan}
                      </p>
                      
                      <div className="pt-2 text-[11px] space-y-1">
                        <div className="text-slate-400 font-semibold">Key Advantages:</div>
                        <ul className="list-disc list-inside text-slate-300 space-y-0.5">
                          {selectedOption.pros.map((p, i) => (
                            <li key={i}>{p}</li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    {/* Materials & Lighting Specification */}
                    <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-700/70 space-y-2">
                      <h4 className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                        <Palette className="w-3.5 h-3.5 text-indigo-400" />
                        <span>Specifications & ERP Master Rate Alignment</span>
                      </h4>

                      <div className="space-y-1.5">
                        {selectedOption.materials.map((mat, i) => (
                          <div key={i} className="flex items-center justify-between text-[11px] bg-slate-900/60 px-2.5 py-1.5 rounded-lg border border-slate-700/50">
                            <div>
                              <span className="font-semibold text-white">{mat.item}</span>
                              <span className="text-slate-400 text-[10px] block truncate max-w-xs">{mat.specification}</span>
                            </div>
                            <span className="text-amber-400 font-bold shrink-0">
                              ₹{mat.costPerUnit}/{mat.unit}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex items-center justify-between text-xs border-t border-slate-700/80">
                        <span className="text-slate-400">Total Room Interior Budget:</span>
                        <span className="font-bold text-emerald-400 text-sm">
                          ₹{selectedOption.totalEstimatedCost.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM ACTION BAR */}
                  <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="px-4 py-2 border border-slate-700 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 transition"
                    >
                      ← Modify Specifications
                    </button>

                    <div className="flex items-center gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-xs font-semibold text-slate-400 hover:text-white transition"
                      >
                        Cancel
                      </button>

                      <button
                        type="button"
                        onClick={handleApplyToStudio}
                        disabled={!activeRenderUrl}
                        className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow-lg disabled:opacity-50"
                      >
                        <Check className="w-4 h-4" />
                        <span>Apply Option & Render to Studio Workspace</span>
                      </button>
                    </div>
                  </div>

                </div>
              )}

            </div>
          )}

        </div>

      </div>
    </div>
  );
};
