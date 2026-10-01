import React, { useState } from 'react';
import { 
  Columns, 
  X, 
  Check, 
  Eye, 
  DollarSign, 
  Ruler, 
  Layers, 
  Palette, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { VILLA_253_THEMES, Villa253ThemeConfig } from '../../data/villa253BlueprintData';
import { ExtractedRoomGeometry, VisualConceptVersion } from '../../types/floorplanSpatial';

interface ThemeComparisonModalProps {
  isOpen: boolean;
  onClose: () => void;
  room: ExtractedRoomGeometry;
  currentConcept: VisualConceptVersion;
  onSelectTheme: (theme: Villa253ThemeConfig) => void;
}

export const ThemeComparisonModal: React.FC<ThemeComparisonModalProps> = ({
  isOpen,
  onClose,
  room,
  currentConcept,
  onSelectTheme
}) => {
  const [selectedThemeIds, setSelectedThemeIds] = useState<string[]>([
    'THEME-WARM-LUXURY',
    'THEME-JAPANDI-ZEN',
    'THEME-BIOPHILIC-TROPICAL'
  ]);

  if (!isOpen) return null;

  const comparedThemes = VILLA_253_THEMES.filter(t => selectedThemeIds.includes(t.id));

  const handleToggleTheme = (id: string) => {
    if (selectedThemeIds.includes(id)) {
      if (selectedThemeIds.length > 2) {
        setSelectedThemeIds(selectedThemeIds.filter(t => t !== id));
      }
    } else {
      if (selectedThemeIds.length < 3) {
        setSelectedThemeIds([...selectedThemeIds, id]);
      } else {
        setSelectedThemeIds([selectedThemeIds[1], selectedThemeIds[2], id]);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[94vh] flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  Side-by-Side Interior Theme Comparison
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-700/60">
                  {room.name} ({room.lengthFt.toFixed(1)}' × {room.widthFt.toFixed(1)}')
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Compare finishes, palettes, renders, and budget implications side-by-side with locked 2D floor geometry.
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

        {/* Theme Selectors Bar */}
        <div className="px-5 py-2.5 bg-slate-950/50 border-b border-slate-800 flex items-center justify-between shrink-0 overflow-x-auto gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-400 font-medium">Select up to 3 themes to compare:</span>
            {VILLA_253_THEMES.map(theme => {
              const isChecked = selectedThemeIds.includes(theme.id);
              return (
                <button
                  key={theme.id}
                  onClick={() => handleToggleTheme(theme.id)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    isChecked 
                      ? 'bg-blue-600 text-white font-bold shadow' 
                      : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{theme.name}</span>
                </button>
              );
            })}
          </div>

          <span className="text-[11px] text-slate-400 font-mono">
            {selectedThemeIds.length} of 3 Selected
          </span>
        </div>

        {/* Comparison Matrix Body */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-6">
          <div className={`grid grid-cols-1 md:grid-cols-${comparedThemes.length} gap-4`}>
            {comparedThemes.map((theme, idx) => {
              const isCurrent = currentConcept.styleTheme.toLowerCase().includes(theme.name.toLowerCase().slice(0, 10));
              return (
                <div 
                  key={theme.id} 
                  className={`rounded-xl border flex flex-col justify-between overflow-hidden transition-all ${
                    isCurrent 
                      ? 'bg-slate-900 border-amber-500/80 ring-2 ring-amber-500/20' 
                      : 'bg-slate-950/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  {/* Top section */}
                  <div>
                    {/* Visual 3D Render */}
                    <div className="relative h-48 w-full overflow-hidden bg-slate-950 border-b border-slate-800">
                      <img 
                        src={theme.renderImage} 
                        alt={theme.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                      
                      <div className="absolute top-2 left-2 flex items-center gap-1.5">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-900/90 text-white border border-slate-700">
                          OPTION {String.fromCharCode(65 + idx)}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
                            CURRENTLY ACTIVE
                          </span>
                        )}
                      </div>

                      <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between text-xs">
                        <span className="font-mono text-white font-bold">{theme.name}</span>
                        <span className="font-mono text-amber-400">{theme.cctKelvin}K CCT</span>
                      </div>
                    </div>

                    <div className="p-4 space-y-4">
                      {/* Tagline */}
                      <div>
                        <h3 className="text-sm font-bold text-white mb-1">{theme.name}</h3>
                        <p className="text-xs text-amber-300/90 font-medium mb-1.5">{theme.tagline}</p>
                        <p className="text-[11px] text-slate-400 leading-relaxed">
                          {theme.description}
                        </p>
                      </div>

                      {/* Color Palette Strip */}
                      <div>
                        <span className="text-[11px] font-semibold text-slate-300 block mb-1.5">
                          Architectural Palette:
                        </span>
                        <div className="h-6 rounded-lg overflow-hidden flex border border-slate-700 shadow-sm">
                          {Object.entries(theme.palette).map(([k, col]) => (
                            <div 
                              key={k} 
                              className="h-full flex-1"
                              style={{ backgroundColor: col }}
                              title={`${k}: ${col}`}
                            />
                          ))}
                        </div>
                      </div>

                      {/* Material Specifications Breakdown */}
                      <div className="space-y-2 pt-2 border-t border-slate-800 text-xs">
                        <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider block">
                          Key Trade Specifications
                        </span>
                        <div className="bg-slate-900/80 rounded-lg p-2.5 space-y-1.5 text-[11px]">
                          <div>
                            <span className="text-slate-400 block font-mono text-[10px]">FLOORING:</span>
                            <span className="text-white font-medium">{theme.specifications.flooring}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-mono text-[10px]">WALLS & CLADDING:</span>
                            <span className="text-white font-medium">{theme.specifications.wallCladding}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-mono text-[10px]">CEILING & LIGHTING:</span>
                            <span className="text-white font-medium">{theme.specifications.ceiling}</span>
                          </div>
                          <div>
                            <span className="text-slate-400 block font-mono text-[10px]">CABINETRY & JOINERY:</span>
                            <span className="text-white font-medium">{theme.specifications.joinery}</span>
                          </div>
                        </div>
                      </div>

                      {/* Vibe Tags */}
                      <div className="flex flex-wrap gap-1">
                        {theme.vibeTags.map((tag, tIdx) => (
                          <span 
                            key={tIdx} 
                            className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800/80 text-slate-300 border border-slate-700/60"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Action bottom button */}
                  <div className="p-4 pt-2 border-t border-slate-800 bg-slate-950/40">
                    <button
                      onClick={() => {
                        onSelectTheme(theme);
                        onClose();
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                        isCurrent 
                          ? 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-md shadow-amber-500/20' 
                          : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md shadow-blue-600/20'
                      }`}
                    >
                      <Check className="w-4 h-4 stroke-[2.5]" />
                      <span>{isCurrent ? 'Keep & Refine This Theme' : `Apply ${theme.name}`}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>All options strictly preserve verified room perimeter ({room.lengthFt.toFixed(1)}' × {room.widthFt.toFixed(1)}') and circulation clearances</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Comparison
          </button>
        </div>

      </div>
    </div>
  );
};
