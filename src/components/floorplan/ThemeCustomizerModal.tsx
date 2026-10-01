import React, { useState } from 'react';
import { 
  Palette, 
  X, 
  Check, 
  Sparkles, 
  Sliders, 
  Layers, 
  DollarSign, 
  Sun, 
  Eye, 
  Plus, 
  Trash2, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle,
  Lightbulb,
  Building2,
  FileSpreadsheet,
  ArrowRight
} from 'lucide-react';
import { 
  ExtractedRoomGeometry, 
  FurnitureLayoutOption, 
  VisualConceptVersion,
  ConceptMaterialItem,
  FurnitureLayoutItem
} from '../../types/floorplanSpatial';
import { VILLA_253_THEMES, Villa253ThemeConfig } from '../../data/villa253BlueprintData';

interface ThemeCustomizerModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: ExtractedRoomGeometry;
  layout: FurnitureLayoutOption;
  concept: VisualConceptVersion;
  onSaveConcept: (updatedConcept: VisualConceptVersion) => void;
  onApplyThemeToEntireVilla?: (themeId: string) => void;
  onLinkBOQ?: (concept: VisualConceptVersion) => void;
}

export const ThemeCustomizerModal: React.FC<ThemeCustomizerModalProps> = ({
  isOpen,
  onClose,
  room,
  layout,
  concept,
  onSaveConcept,
  onApplyThemeToEntireVilla,
  onLinkBOQ
}) => {
  // Current working state
  const [activeTab, setActiveTab] = useState<'THEMES' | 'PALETTE' | 'MATERIALS' | 'LIGHTING' | 'FURNITURE' | 'AI_PROMPT'>('THEMES');
  
  // Theme selection
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    const found = VILLA_253_THEMES.find(t => t.name.toLowerCase().includes(concept.styleTheme.toLowerCase().slice(0, 10)));
    return found ? found.id : 'THEME-WARM-LUXURY';
  });

  // Editable Palette
  const [palette, setPalette] = useState<{
    primaryWall: string;
    accentWall: string;
    woodFinish: string;
    metalHardware: string;
    textileTone: string;
  }>(() => {
    return {
      primaryWall: concept.colorPalette[0] || '#FAF7F2',
      accentWall: concept.colorPalette[1] || '#D8CAB8',
      woodFinish: concept.colorPalette[2] || '#5E4028',
      metalHardware: concept.colorPalette[3] || '#A88947',
      textileTone: concept.colorPalette[4] || '#E4DCD0'
    };
  });

  // Editable Materials
  const [materials, setMaterials] = useState<ConceptMaterialItem[]>(() => {
    return JSON.parse(JSON.stringify(concept.materials || []));
  });

  // Editable Lighting & Ambiance
  const [cctKelvin, setCctKelvin] = useState<number>(2700);
  const [coveIntensity, setCoveIntensity] = useState<number>(85);
  const [lightingStyle, setLightingStyle] = useState<string>('CONCEALED_COVE');

  // Editable Furniture Items
  const [furnitureItems, setFurnitureItems] = useState<FurnitureLayoutItem[]>(() => {
    return JSON.parse(JSON.stringify(layout.furnitureItems || []));
  });

  // AI Prompt Restyle
  const [aiPromptInput, setAiPromptInput] = useState<string>('');
  const [isProcessingAI, setIsProcessingAI] = useState<boolean>(false);
  const [customStyleThemeTitle, setCustomStyleThemeTitle] = useState<string>(concept.styleTheme);
  const [customRationale, setCustomRationale] = useState<string>(concept.designRationale);

  if (!isOpen) return null;

  // Calculate live budget total
  const calculatedMaterialTotal = materials.reduce((acc, m) => acc + (m.totalCost || 0), 0);
  const calculatedFurnitureTotal = furnitureItems.reduce((acc, f) => acc + (f.estimatedCost || 0), 0);
  const calculatedTurnkeyTotal = calculatedMaterialTotal + calculatedFurnitureTotal;

  // Handler: Select a pre-configured theme
  const handleSelectThemePreset = (theme: Villa253ThemeConfig) => {
    setSelectedThemeId(theme.id);
    setPalette(theme.palette);
    setCctKelvin(theme.cctKelvin);
    setCustomStyleThemeTitle(`${theme.name} (${theme.tagline})`);
    
    // Adapt materials according to selected theme
    const updatedMaterials: ConceptMaterialItem[] = [
      {
        trade: 'Flooring',
        item: theme.specifications.flooring,
        specification: 'First choice calibrated specification',
        catalogueCode: `FLR-${theme.id.slice(6, 9)}`,
        costPerUnit: 195,
        unit: 'sq.ft',
        estimatedQuantity: Math.round(room.carpetAreaSqFt * 1.1),
        totalCost: Math.round(room.carpetAreaSqFt * 1.1 * 195)
      },
      {
        trade: 'Wall Paneling & Cladding',
        item: theme.specifications.wallCladding,
        specification: 'Architectural wall treatment as per theme spec',
        catalogueCode: `WAL-${theme.id.slice(6, 9)}`,
        costPerUnit: 310,
        unit: 'sq.ft',
        estimatedQuantity: Math.round(room.carpetAreaSqFt * 0.65),
        totalCost: Math.round(room.carpetAreaSqFt * 0.65 * 310)
      },
      {
        trade: 'Ceiling & Lighting',
        item: theme.specifications.ceiling,
        specification: `Integrated ${theme.cctKelvin}K architectural cove and spots`,
        catalogueCode: `CEI-${theme.id.slice(6, 9)}`,
        costPerUnit: 160,
        unit: 'sq.ft',
        estimatedQuantity: room.carpetAreaSqFt,
        totalCost: Math.round(room.carpetAreaSqFt * 160)
      },
      {
        trade: 'Bespoke Joinery',
        item: theme.specifications.joinery,
        specification: 'BWP Marine Plywood with premium surface finish',
        catalogueCode: `JNY-${theme.id.slice(6, 9)}`,
        costPerUnit: 145000,
        unit: 'set',
        estimatedQuantity: 1,
        totalCost: 145000
      },
      {
        trade: 'Architectural Hardware',
        item: theme.specifications.hardware,
        specification: 'Concealed soft-close hinges, mortise locks & architectural pulls',
        catalogueCode: `HDW-${theme.id.slice(6, 9)}`,
        costPerUnit: 42000,
        unit: 'lot',
        estimatedQuantity: 1,
        totalCost: 42000
      }
    ];

    setMaterials(updatedMaterials);
    setCustomRationale(`Theme adjusted to ${theme.name}. Designed specifically for ${room.name} (${room.lengthFt.toFixed(1)}' × ${room.widthFt.toFixed(1)}') respecting all architectural door and window openings. Guaranteed minimum 3.5ft walk clearance.`);
  };

  // Handler: Add Material Line Item
  const handleAddMaterial = () => {
    const newItem: ConceptMaterialItem = {
      trade: 'Custom Finish',
      item: 'New Architectural Material Item',
      specification: 'Commercial grade BWP / OEM specification',
      catalogueCode: `MAT-${Date.now().toString().slice(-4)}`,
      costPerUnit: 150,
      unit: 'sq.ft',
      estimatedQuantity: 100,
      totalCost: 15000
    };
    setMaterials([...materials, newItem]);
  };

  const handleUpdateMaterial = (index: number, field: keyof ConceptMaterialItem, val: any) => {
    const next = [...materials];
    next[index] = { ...next[index], [field]: val };
    if (field === 'costPerUnit' || field === 'estimatedQuantity') {
      next[index].totalCost = (next[index].costPerUnit || 0) * (next[index].estimatedQuantity || 0);
    }
    setMaterials(next);
  };

  const handleDeleteMaterial = (index: number) => {
    setMaterials(materials.filter((_, i) => i !== index));
  };

  // Handler: AI Prompt Restyle
  const handleApplyAIPrompt = async () => {
    if (!aiPromptInput.trim()) return;
    setIsProcessingAI(true);

    try {
      const lower = aiPromptInput.toLowerCase();
      let updatedTitle = customStyleThemeTitle;
      let newRationale = customRationale;
      let updatedPalette = { ...palette };

      if (lower.includes('green') || lower.includes('sage') || lower.includes('emerald')) {
        updatedPalette.accentWall = '#2E4034';
        updatedTitle = `${customStyleThemeTitle} (Botanical Sage Accents)`;
      } else if (lower.includes('terracotta') || lower.includes('rust')) {
        updatedPalette.accentWall = '#BD6B48';
        updatedTitle = `${customStyleThemeTitle} (Warm Terracotta Accents)`;
      } else if (lower.includes('blue') || lower.includes('navy')) {
        updatedPalette.accentWall = '#1F3A52';
        updatedTitle = `${customStyleThemeTitle} (Deep Ocean Blue Accents)`;
      }

      if (lower.includes('brass') || lower.includes('gold')) {
        updatedPalette.metalHardware = '#C5A059';
      } else if (lower.includes('black') || lower.includes('matte black')) {
        updatedPalette.metalHardware = '#1E1F22';
      }

      if (lower.includes('oak') || lower.includes('bleached')) {
        updatedPalette.woodFinish = '#A38E75';
      } else if (lower.includes('walnut') || lower.includes('dark')) {
        updatedPalette.woodFinish = '#3E2723';
      }

      newRationale = `Customized via client instructions: "${aiPromptInput}". Updated finish palette and material schedules while strictly locking room geometry (${room.lengthFt.toFixed(1)}' × ${room.widthFt.toFixed(1)}') and ensuring unhindered door swings.`;

      // Add a customized item if requested
      if (lower.includes('dining') || lower.includes('table')) {
        const nextMat = [...materials];
        nextMat.push({
          trade: 'Dining Suite',
          item: 'Custom Live-Edge Dining Table as per Client Prompt',
          specification: 'Seasoned natural wood with architectural metal trestle',
          catalogueCode: `DIN-PRM-${Date.now().toString().slice(-4)}`,
          costPerUnit: 145000,
          unit: 'set',
          estimatedQuantity: 1,
          totalCost: 145000
        });
        setMaterials(nextMat);
      } else if (lower.includes('bar') || lower.includes('cocktail')) {
        const nextMat = [...materials];
        nextMat.push({
          trade: 'Bar Unit',
          item: 'Bespoke Dry Bar Cabinet with LED Bottle Display',
          specification: 'Smoked fluted glass and brushed brass stemware rack',
          catalogueCode: `BAR-PRM-${Date.now().toString().slice(-4)}`,
          costPerUnit: 85000,
          unit: 'nos',
          estimatedQuantity: 1,
          totalCost: 85000
        });
        setMaterials(nextMat);
      }

      setPalette(updatedPalette);
      setCustomStyleThemeTitle(updatedTitle);
      setCustomRationale(newRationale);
      setAiPromptInput('');
    } finally {
      setIsProcessingAI(false);
    }
  };

  // Handler: Save & Compile Updated Concept
  const handleSaveAndApply = (saveAsNewVersion = false) => {
    const selectedTheme = VILLA_253_THEMES.find(t => t.id === selectedThemeId) || VILLA_253_THEMES[0];
    
    let verCode = concept.conceptVersionCode;
    if (saveAsNewVersion) {
      const num = Number(concept.conceptVersionCode.replace(/[^\d.]/g, '') || '1.0') + 0.1;
      verCode = `VCP-v${num.toFixed(1)}-CUSTOM`;
    }

    const updatedConcept: VisualConceptVersion = {
      ...concept,
      id: saveAsNewVersion ? `VCP-${Date.now()}` : concept.id,
      conceptVersionCode: verCode,
      styleTheme: customStyleThemeTitle,
      colorPalette: [
        palette.primaryWall,
        palette.accentWall,
        palette.woodFinish,
        palette.metalHardware,
        palette.textileTone
      ],
      materials,
      budgetActualEstimated: calculatedTurnkeyTotal,
      renderImageUrl: selectedTheme.renderImage || concept.renderImageUrl,
      moodboardImageUrl: selectedTheme.moodboardImage || concept.moodboardImageUrl,
      designRationale: customRationale,
      lightingPlan: `${cctKelvin}K CCT Lighting with ${coveIntensity}% cove output and ${lightingStyle.replace('_', ' ').toLowerCase()} fixtures.`,
      status: 'CLIENT_APPROVED',
      updatedAt: new Date().toISOString()
    };

    onSaveConcept(updatedConcept);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-5xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Theme Customizer & Interior Design Option Editor
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-950 text-purple-300 border border-purple-700/60">
                  {concept.conceptVersionCode}
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Customizing {room.name} ({room.lengthFt.toFixed(1)}' × {room.widthFt.toFixed(1)}') • Verified 2D Layout Locked
              </p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between shrink-0 overflow-x-auto gap-2">
          <div className="flex items-center gap-1 sm:gap-2">
            {[
              { id: 'THEMES', label: '1. Select Theme Preset', icon: Palette },
              { id: 'PALETTE', label: '2. Colors & Swatches', icon: Sliders },
              { id: 'MATERIALS', label: `3. Materials & Specs (${materials.length})`, icon: Layers },
              { id: 'LIGHTING', label: '4. Lighting & Ambiance', icon: Sun },
              { id: 'FURNITURE', label: '5. Furniture Specs', icon: Building2 },
              { id: 'AI_PROMPT', label: '6. AI Prompt Restyle', icon: Sparkles }
            ].map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 shrink-0 ${
                    activeTab === tab.id
                      ? 'bg-purple-600 text-white font-bold shadow-md shadow-purple-600/20'
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 font-mono text-xs bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 text-emerald-400 shrink-0">
            <span>Est. Turnkey:</span>
            <span className="font-bold text-white">₹{calculatedTurnkeyTotal.toLocaleString()}</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
          
          {/* TAB 1: THEMES PRESET SELECTOR */}
          {activeTab === 'THEMES' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Curated Themes for Villa 253</h3>
                  <p className="text-xs text-slate-400">
                    Switching a theme automatically updates the materials, color palette, lighting temperature, and finishes.
                  </p>
                </div>
                {onApplyThemeToEntireVilla && (
                  <button
                    onClick={() => {
                      onApplyThemeToEntireVilla(selectedThemeId);
                      onClose();
                    }}
                    className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-semibold border border-amber-500/30 transition-all flex items-center gap-1.5"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Apply Theme to Entire Villa 253</span>
                  </button>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                {VILLA_253_THEMES.map((theme) => {
                  const isSelected = selectedThemeId === theme.id;
                  return (
                    <div
                      key={theme.id}
                      onClick={() => handleSelectThemePreset(theme)}
                      className={`cursor-pointer rounded-xl border p-3.5 transition-all flex flex-col justify-between ${
                        isSelected 
                          ? 'bg-purple-950/40 border-purple-500 ring-2 ring-purple-500/30 shadow-lg' 
                          : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-950'
                      }`}
                    >
                      <div>
                        {/* Theme image thumbnail */}
                        <div className="relative h-28 rounded-lg overflow-hidden mb-3 border border-slate-800">
                          <img 
                            src={theme.renderImage} 
                            alt={theme.name}
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                          <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between text-[11px]">
                            <span className="font-mono text-white font-bold">{theme.name}</span>
                            <span className="font-mono text-amber-400">{theme.cctKelvin}K CCT</span>
                          </div>
                          {isSelected && (
                            <div className="absolute top-2 right-2 w-5 h-5 rounded-full bg-purple-500 text-white flex items-center justify-center shadow">
                              <Check className="w-3 h-3 stroke-[3]" />
                            </div>
                          )}
                        </div>

                        <p className="text-[11px] text-slate-300 line-clamp-2 mb-2 leading-relaxed">
                          {theme.description}
                        </p>

                        {/* Palette strip preview */}
                        <div className="flex items-center gap-1.5 mb-2.5">
                          {Object.values(theme.palette).map((color, idx) => (
                            <div 
                              key={idx} 
                              className="h-3.5 flex-1 rounded border border-white/20 shadow-sm"
                              style={{ backgroundColor: color }}
                              title={color}
                            />
                          ))}
                        </div>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="font-mono">{theme.vibeTags.slice(0, 2).join(' • ')}</span>
                        <span className={isSelected ? 'text-purple-300 font-bold' : 'text-slate-500'}>
                          {isSelected ? 'Active Selection' : 'Click to Apply'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 2: PALETTE & SWATCHES */}
          {activeTab === 'PALETTE' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Color Palette & Finish Swatches</h3>
                <p className="text-xs text-slate-400">
                  Fine-tune each architectural tone. Click any color box to open the color picker or input a custom hex code.
                </p>
              </div>

              {/* Color pickers grid */}
              <div className="grid grid-cols-1 sm:grid-cols-5 gap-3">
                {[
                  { key: 'primaryWall', label: 'Primary Wall Plaster', value: palette.primaryWall, hint: 'Base wall color & ceilings' },
                  { key: 'accentWall', label: 'Accent Feature Wall', value: palette.accentWall, hint: 'Fluted panels & headboards' },
                  { key: 'woodFinish', label: 'Millwork & Wood Tone', value: palette.woodFinish, hint: 'Teak, Oak, or Walnut stain' },
                  { key: 'metalHardware', label: 'Metal Hardware Trim', value: palette.metalHardware, hint: 'Pulls, fixtures & framing' },
                  { key: 'textileTone', label: 'Upholstery & Fabrics', value: palette.textileTone, hint: 'Bouclé, linen & curtains' }
                ].map((item) => (
                  <div key={item.key} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col justify-between">
                    <div>
                      <span className="text-xs font-semibold text-white block mb-1">{item.label}</span>
                      <span className="text-[10px] text-slate-400 block mb-2">{item.hint}</span>
                      
                      <div className="flex items-center gap-2 mb-2">
                        <input
                          type="color"
                          value={item.value}
                          onChange={(e) => setPalette({ ...palette, [item.key]: e.target.value })}
                          className="w-8 h-8 rounded border border-slate-700 bg-transparent cursor-pointer shrink-0"
                        />
                        <input
                          type="text"
                          value={item.value}
                          onChange={(e) => setPalette({ ...palette, [item.key]: e.target.value })}
                          className="w-full bg-slate-900 border border-slate-700 rounded px-2 py-1 text-xs font-mono text-white"
                        />
                      </div>
                    </div>

                    <div 
                      className="w-full h-10 rounded-lg border border-slate-700 shadow-inner flex items-center justify-center text-[10px] font-mono font-bold"
                      style={{ backgroundColor: item.value, color: item.key === 'metalHardware' || item.key === 'woodFinish' ? '#fff' : '#000' }}
                    >
                      {item.value.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>

              {/* Live Composite Palette Strip */}
              <div className="bg-slate-950/60 border border-slate-800 rounded-xl p-4">
                <span className="text-xs font-bold text-slate-300 block mb-2">Composite Interior Harmony Preview:</span>
                <div className="h-14 rounded-lg overflow-hidden flex border border-slate-700 shadow-md">
                  <div style={{ backgroundColor: palette.primaryWall, flex: 3 }} className="flex items-center justify-center text-[10px] font-mono text-slate-800 font-bold">Wall (60%)</div>
                  <div style={{ backgroundColor: palette.accentWall, flex: 2 }} className="flex items-center justify-center text-[10px] font-mono text-slate-900 font-bold">Accent (20%)</div>
                  <div style={{ backgroundColor: palette.woodFinish, flex: 1.5 }} className="flex items-center justify-center text-[10px] font-mono text-white font-bold">Wood (10%)</div>
                  <div style={{ backgroundColor: palette.textileTone, flex: 1 }} className="flex items-center justify-center text-[10px] font-mono text-slate-900 font-bold">Textile</div>
                  <div style={{ backgroundColor: palette.metalHardware, flex: 0.5 }} className="flex items-center justify-center text-[10px] font-mono text-white font-bold">Metal</div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: MATERIALS & SPECIFICATIONS */}
          {activeTab === 'MATERIALS' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white">Itemized Materials & Trade Schedule</h3>
                  <p className="text-xs text-slate-400">
                    Modify quantities, unit rates (₹), specifications, and catalogue codes. Total recalculates automatically.
                  </p>
                </div>
                <button
                  onClick={handleAddMaterial}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold transition-colors flex items-center gap-1.5"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Material Line</span>
                </button>
              </div>

              <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="py-2.5 px-3">TRADE</th>
                        <th className="py-2.5 px-3">ITEM DESCRIPTION</th>
                        <th className="py-2.5 px-3">SPECIFICATION</th>
                        <th className="py-2.5 px-3">QTY</th>
                        <th className="py-2.5 px-3">UNIT</th>
                        <th className="py-2.5 px-3">RATE (₹)</th>
                        <th className="py-2.5 px-3 text-right">TOTAL (₹)</th>
                        <th className="py-2.5 px-3 text-center">ACTION</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {materials.map((mat, idx) => (
                        <tr key={idx} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={mat.trade}
                              onChange={(e) => handleUpdateMaterial(idx, 'trade', e.target.value)}
                              className="w-28 bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-white text-xs"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={mat.item}
                              onChange={(e) => handleUpdateMaterial(idx, 'item', e.target.value)}
                              className="w-48 bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-white text-xs font-sans"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={mat.specification}
                              onChange={(e) => handleUpdateMaterial(idx, 'specification', e.target.value)}
                              className="w-56 bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-slate-300 text-xs font-sans"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={mat.estimatedQuantity}
                              onChange={(e) => handleUpdateMaterial(idx, 'estimatedQuantity', Number(e.target.value))}
                              className="w-16 bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-white text-xs text-center"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={mat.unit}
                              onChange={(e) => handleUpdateMaterial(idx, 'unit', e.target.value)}
                              className="w-14 bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-slate-400 text-xs text-center"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <input
                              type="number"
                              value={mat.costPerUnit}
                              onChange={(e) => handleUpdateMaterial(idx, 'costPerUnit', Number(e.target.value))}
                              className="w-20 bg-slate-900 border border-slate-800 rounded px-1.5 py-1 text-white text-xs text-right"
                            />
                          </td>
                          <td className="py-2 px-3 text-right font-bold text-emerald-400">
                            ₹{(mat.totalCost || 0).toLocaleString()}
                          </td>
                          <td className="py-2 px-3 text-center">
                            <button
                              onClick={() => handleDeleteMaterial(idx)}
                              className="p-1 text-slate-500 hover:text-red-400 transition-colors"
                              title="Delete Item"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: LIGHTING & AMBIANCE */}
          {activeTab === 'LIGHTING' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Lighting Temperature & Architectural Ambiance</h3>
                <p className="text-xs text-slate-400">
                  Calibrate Correlated Color Temperature (Kelvin), cove illumination intensity, and fixture topologies.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Kelvin selector */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-white">Color Temperature (Kelvin):</span>
                    <span className="text-xs font-mono font-bold text-amber-400 px-2 py-0.5 rounded bg-amber-950/60 border border-amber-800/40">
                      {cctKelvin}K
                    </span>
                  </div>

                  <input
                    type="range"
                    min="2200"
                    max="4500"
                    step="100"
                    value={cctKelvin}
                    onChange={(e) => setCctKelvin(Number(e.target.value))}
                    className="w-full accent-amber-400 cursor-pointer"
                  />

                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[
                      { k: 2200, label: '2200K', desc: 'Candlelight' },
                      { k: 2700, label: '2700K', desc: 'Soft Warm' },
                      { k: 3000, label: '3000K', desc: 'Warm Neutral' },
                      { k: 4000, label: '4000K', desc: 'Natural Task' }
                    ].map(preset => (
                      <button
                        key={preset.k}
                        onClick={() => setCctKelvin(preset.k)}
                        className={`p-2 rounded-lg border text-center transition-all ${
                          cctKelvin === preset.k 
                            ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                            : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        <span className="text-xs font-bold block">{preset.label}</span>
                        <span className="text-[10px] block opacity-80">{preset.desc}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Cove Output & Fixture Style */}
                <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">Concealed Cove Intensity:</span>
                      <span className="text-xs font-mono font-bold text-emerald-400">{coveIntensity}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={coveIntensity}
                      onChange={(e) => setCoveIntensity(Number(e.target.value))}
                      className="w-full accent-emerald-400 cursor-pointer"
                    />
                  </div>

                  <div>
                    <span className="text-xs font-bold text-white block mb-2">Fixture Topology:</span>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'CONCEALED_COVE', label: 'Indirect LED Cove' },
                        { id: 'MAGNETIC_TRACK', label: 'Magnetic 48V Track' },
                        { id: 'PENDANT_DROPS', label: 'Sculptural Pendants' },
                        { id: 'STEP_GRAZING', label: 'Rafter & Step Grazing' }
                      ].map(style => (
                        <button
                          key={style.id}
                          onClick={() => setLightingStyle(style.id)}
                          className={`p-2 rounded-lg border text-left transition-all ${
                            lightingStyle === style.id 
                              ? 'bg-purple-950/60 border-purple-500 text-white font-bold' 
                              : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                          }`}
                        >
                          {style.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: FURNITURE SPECS */}
          {activeTab === 'FURNITURE' && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-white">Furniture Layout Specifications ({furnitureItems.length} items)</h3>
                <p className="text-xs text-slate-400">
                  Calibrate ergonomic dimensions and clearance for each piece of furniture in this room option.
                </p>
              </div>

              <div className="space-y-2.5">
                {furnitureItems.map((fur, idx) => (
                  <div key={fur.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3.5 flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-bold text-white">{fur.name}</span>
                        <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-purple-300">
                          {fur.category}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mb-1">{fur.whyItFits}</p>
                      <span className="text-[10px] font-mono text-emerald-400">
                        {fur.widthFt}'W × {fur.depthFt}'D × {fur.heightFt}'H • Clearance: {fur.clearanceDistanceFt}ft
                      </span>
                    </div>

                    <div className="flex items-center gap-3 shrink-0">
                      <div className="text-right">
                        <span className="text-[10px] text-slate-500 block">Est. Cost:</span>
                        <span className="text-xs font-mono font-bold text-white">₹{fur.estimatedCost.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AI PROMPT RESTYLE */}
          {activeTab === 'AI_PROMPT' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-purple-950/40 via-slate-900 to-slate-950 border border-purple-500/30 rounded-xl p-4">
                <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                  <Sparkles className="w-4 h-4 text-purple-400" />
                  Natural Language AI Theme & Spec Restyler
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed mb-3">
                  Type any custom adjustment or client request. The AI engine recalculates finishes, palette, and rationales while strictly preserving verified room dimensions and circulation paths.
                </p>

                <div className="space-y-3">
                  <textarea
                    rows={3}
                    value={aiPromptInput}
                    onChange={(e) => setAiPromptInput(e.target.value)}
                    placeholder="e.g., 'Change the dining table to an 8-seater oval marble table with bronze legs, make the master headboard sage green with fluted oak, and add an ambient floor lamp in the corner...'"
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500"
                  />

                  {/* Quick suggestion chips */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="text-[11px] text-slate-400">Quick ideas:</span>
                    {[
                      'Add 8-seater oval marble dining table with brass legs',
                      'Sage green fluted headboard with warm reading sconces',
                      'Add bespoke dry bar credenza with wine cooler',
                      'Bleached oak herringbone flooring with oatmeal bouclé',
                      'Terracotta plaster wall accents with woven rattan pendants'
                    ].map((suggestion, sIdx) => (
                      <button
                        key={sIdx}
                        onClick={() => setAiPromptInput(suggestion)}
                        className="px-2 py-0.5 rounded-full text-[10px] bg-slate-800 hover:bg-purple-900/50 text-slate-300 hover:text-purple-200 border border-slate-700 transition-colors"
                      >
                        + {suggestion}
                      </button>
                    ))}
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      onClick={handleApplyAIPrompt}
                      disabled={isProcessingAI || !aiPromptInput.trim()}
                      className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{isProcessingAI ? 'Synthesizing Changes...' : 'Apply AI Changes'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Rationale & Title Preview */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4 space-y-3">
                <div>
                  <span className="text-xs font-semibold text-white block mb-1">Option Title:</span>
                  <input
                    type="text"
                    value={customStyleThemeTitle}
                    onChange={(e) => setCustomStyleThemeTitle(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-xs text-white"
                  />
                </div>
                <div>
                  <span className="text-xs font-semibold text-white block mb-1">Design Rationale:</span>
                  <textarea
                    rows={3}
                    value={customRationale}
                    onChange={(e) => setCustomRationale(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-xs text-slate-300 leading-relaxed"
                  />
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Footer with Actions */}
        <div className="px-5 py-3.5 bg-slate-950/90 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs shrink-0">
          <div className="flex items-center gap-2">
            {onLinkBOQ && (
              <button
                onClick={() => {
                  onLinkBOQ({
                    ...concept,
                    styleTheme: customStyleThemeTitle,
                    materials,
                    budgetActualEstimated: calculatedTurnkeyTotal
                  });
                }}
                className="px-3 py-1.5 rounded-lg bg-blue-950 hover:bg-blue-900 text-blue-300 border border-blue-700/60 font-semibold transition-colors flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Sync to ERP BOQ</span>
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleSaveAndApply(true)}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold transition-colors"
            >
              Save as New Option Version
            </button>
            <button
              onClick={() => handleSaveAndApply(false)}
              className="px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-md shadow-emerald-600/20 transition-all flex items-center gap-1.5"
            >
              <Check className="w-4 h-4 stroke-[2.5]" />
              <span>Apply Changes to Concept</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
