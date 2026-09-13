import React, { useState } from 'react';
import {
  Palette,
  CheckCircle2,
  Clock,
  Plus,
  Filter,
  Upload,
  Maximize2,
  Sparkles,
  Leaf,
  DollarSign,
  Tag,
  X,
} from 'lucide-react';
import { ConceptOption, ArchitecturalVisualAsset, MaterialSpec } from '../../types';

interface MaterialSwatchesSheetProps {
  concept: ConceptOption;
  asset?: ArchitecturalVisualAsset;
  clientName: string;
  onAddMaterial?: (material: MaterialSpec) => void;
  onUploadMoodboard?: (fileDataUrl: string, fileName: string) => void;
  onOpenLightbox?: () => void;
}

export const MaterialSwatchesSheet: React.FC<MaterialSwatchesSheetProps> = ({
  concept,
  asset,
  clientName,
  onAddMaterial,
  onUploadMoodboard,
  onOpenLightbox,
}) => {
  const [boardMode, setBoardMode] = useState<'moodboard_render' | 'swatch_grid'>('swatch_grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [approvedSwatches, setApprovedSwatches] = useState<Record<string, boolean>>({});

  // New Material form state
  const [newCategory, setNewCategory] = useState<string>('Flooring');
  const [newMaterialName, setNewMaterialName] = useState<string>('');
  const [newFinish, setNewFinish] = useState<string>('');
  const [newEcoRating, setNewEcoRating] = useState<string>('LEED v4 Compliant / Low-VOC');
  const [newUnitRate, setNewUnitRate] = useState<number>(45);

  const materials = concept.materials || [];

  const categories = ['All', ...Array.from(new Set(materials.map((m) => m.category)))];

  const filteredMaterials = selectedCategory === 'All'
    ? materials
    : materials.filter((m) => m.category === selectedCategory);

  const toggleApproval = (materialName: string) => {
    setApprovedSwatches((prev) => ({
      ...prev,
      [materialName]: !prev[materialName],
    }));
  };

  const handleCreateMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMaterialName.trim()) return;
    if (onAddMaterial) {
      onAddMaterial({
        category: newCategory as MaterialSpec['category'],
        estimatedRatePerUnit: newUnitRate,
        unit: 'sq.ft',
        material: newMaterialName.trim(),
        finish: newFinish.trim() || 'Factory Sealed Natural Finish',
        ecoRating: newEcoRating,
        costTier: newUnitRate > 80 ? 'Premium Luxury' : newUnitRate > 40 ? 'Mid-High Tier' : 'Standard Quality',
        sampleAvailable: true,
      });
    }
    setNewMaterialName('');
    setNewFinish('');
    setIsAddModalOpen(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onUploadMoodboard) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          onUploadMoodboard(event.target.result as string, file.name);
          setBoardMode('moodboard_render');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Swatch color accents based on category
  const getCategorySwatchColor = (cat: string) => {
    const c = cat.toLowerCase();
    if (c.includes('floor') || c.includes('stone')) return 'from-stone-300 to-stone-500 border-stone-400';
    if (c.includes('joinery') || c.includes('wood')) return 'from-amber-700 to-amber-900 border-amber-800';
    if (c.includes('metal') || c.includes('hardware')) return 'from-yellow-500 to-amber-600 border-yellow-400';
    if (c.includes('wall') || c.includes('plaster')) return 'from-slate-200 to-slate-400 border-slate-300';
    if (c.includes('glass') || c.includes('glazing')) return 'from-cyan-100 to-cyan-300 border-cyan-400';
    return 'from-indigo-300 to-indigo-500 border-indigo-400';
  };

  return (
    <div className="space-y-3">
      {/* Moodboard & Swatches Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 rounded-xl bg-slate-900 text-white border border-slate-800 text-xs">
        <div className="flex items-center space-x-2">
          <Palette className="w-4 h-4 text-amber-400" />
          <span className="font-semibold text-slate-200">
            Architectural Material Specifications &amp; Tactile Moodboard
          </span>
          <span className="text-slate-500">•</span>
          <span className="text-amber-400 font-bold">{materials.length} Specified Finishes</span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Mode Switcher */}
          <div className="flex rounded-lg bg-slate-800 p-0.5 border border-slate-700">
            <button
              type="button"
              onClick={() => setBoardMode('swatch_grid')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                boardMode === 'swatch_grid'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Palette className="w-3 h-3" />
              <span>Physical Swatches Grid</span>
            </button>
            <button
              type="button"
              onClick={() => setBoardMode('moodboard_render')}
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center space-x-1 ${
                boardMode === 'moodboard_render'
                  ? 'bg-amber-400 text-slate-950 font-bold'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Sparkles className="w-3 h-3" />
              <span>Curated Flatlay Board</span>
            </button>
          </div>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors font-semibold"
          >
            <Plus className="w-3 h-3" />
            <span>Add Spec</span>
          </button>

          {boardMode === 'moodboard_render' && onOpenLightbox && (
            <button
              type="button"
              onClick={onOpenLightbox}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
            >
              <Maximize2 className="w-3 h-3 text-amber-400" />
              <span>Fullscreen</span>
            </button>
          )}

          <label className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 cursor-pointer transition-colors font-semibold">
            <Upload className="w-3 h-3 text-amber-400" />
            <span>Upload Moodboard</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {boardMode === 'swatch_grid' ? (
        <div className="space-y-3">
          {/* Category Filter Pills */}
          <div className="flex flex-wrap items-center gap-1.5 bg-slate-50 p-2 rounded-xl border border-slate-200">
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wider mr-1 flex items-center">
              <Filter className="w-3 h-3 mr-1 text-slate-400" /> Filter:
            </span>
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Swatches Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {filteredMaterials.map((mat, idx) => {
              const isApproved = approvedSwatches[mat.material] ?? mat.sampleAvailable ?? true;
              return (
                <div
                  key={idx}
                  className="bg-white rounded-xl border border-slate-200 p-3.5 shadow-2xs hover:shadow-xs transition-shadow flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    {/* Header: Color Swatch Chip + Category Badge */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2.5">
                        <div
                          className={`w-7 h-7 rounded-lg bg-gradient-to-br border shadow-xs ${getCategorySwatchColor(
                            mat.category
                          )}`}
                        />
                        <div>
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-slate-500 block">
                            {mat.category}
                          </span>
                          <h4 className="text-xs font-bold text-slate-900 leading-tight">
                            {mat.material}
                          </h4>
                        </div>
                      </div>

                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-700">
                        {mat.costTier || 'Premium Tier'}
                      </span>
                    </div>

                    {/* Finish Detail */}
                    <p className="text-xs text-slate-600 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <strong className="text-slate-800">Finish: </strong>
                      {mat.finish}
                    </p>

                    {/* Eco Rating Badge */}
                    {mat.ecoRating && (
                      <div className="flex items-center space-x-1 text-[11px] text-emerald-700 font-medium">
                        <Leaf className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span className="truncate">{mat.ecoRating}</span>
                      </div>
                    )}
                  </div>

                  {/* Footer: Physical Sample Approval Toggle */}
                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => toggleApproval(mat.material)}
                      className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {isApproved ? (
                        <>
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>Physical Sample Approved</span>
                        </>
                      ) : (
                        <>
                          <Clock className="w-3.5 h-3.5 text-amber-600" />
                          <span>Pending Showroom Review</span>
                        </>
                      )}
                    </button>

                    <span className="text-[10px] font-mono text-slate-400">
                      MAT-0{idx + 1}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        /* Curated Flatlay Moodboard Image View */
        <div className="bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-md relative group">
          <div
            className="relative w-full aspect-16/9 bg-slate-900 overflow-hidden cursor-pointer"
            onClick={onOpenLightbox}
          >
            <img
              src={asset?.imageUrl || '/materials_moodboard.jpg'}
              alt={asset?.title || 'Material Swatches Moodboard'}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-[1.01]"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/30 pointer-events-none" />

            <div className="absolute top-3 left-3 flex items-center space-x-2">
              <span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider font-mono bg-black/70 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                Tactile Material Flatlay
              </span>
              <span className="px-2 py-1 rounded-md text-[10px] font-mono bg-black/60 text-slate-300 backdrop-blur-md border border-white/10">
                {materials.length} Physical Swatches Curated
              </span>
            </div>

            <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between pointer-events-none">
              <div className="max-w-2xl bg-slate-950/80 backdrop-blur-md p-3 rounded-xl border border-white/10">
                <h3 className="text-sm font-bold text-white tracking-tight">
                  {asset?.title || 'Tactile Material Swatches & Finishes Palette'}
                </h3>
                <p className="text-xs text-slate-300 mt-0.5 line-clamp-1">
                  {asset?.subtitle || `Harmonized finishes palette for ${clientName} (${concept.themeStyle})`}
                </p>
              </div>

              <span className="text-[11px] font-semibold text-amber-300 bg-black/70 px-2.5 py-1 rounded-lg backdrop-blur-md border border-amber-500/30">
                Click to Enlarge
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Add Material Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <Palette className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Add Material Specification
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateMaterial} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Material Category
                </label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="Flooring">Flooring (Stone, Parquet, Terrazzo)</option>
                  <option value="Joinery & Woodwork">Joinery &amp; Woodwork (Oak, Walnut)</option>
                  <option value="Wall & Ceiling Finishes">Wall &amp; Ceiling Finishes (Limewash, Slats)</option>
                  <option value="Hardware & Fixtures">Hardware &amp; Fixtures (Brass, Matte Black)</option>
                  <option value="Glazing & Partitions">Glazing &amp; Partitions (Fluted, Low-E)</option>
                  <option value="Countertops & Slabs">Countertops &amp; Slabs (Calacatta, Quartz)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Material Title / Trade Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. European White Oak Chevron Parquet"
                  value={newMaterialName}
                  onChange={(e) => setNewMaterialName(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Finish Treatment &amp; Texture
                </label>
                <input
                  type="text"
                  placeholder="e.g. Brushed Ultra-Matte Polyurethane, 5% Gloss"
                  value={newFinish}
                  onChange={(e) => setNewFinish(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Sustainability / Certification
                </label>
                <input
                  type="text"
                  value={newEcoRating}
                  onChange={(e) => setNewEcoRating(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs"
                >
                  Save Material Swatch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
