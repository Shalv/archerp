import React, { useState } from 'react';
import { 
  Sparkles, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  Layers, 
  Building, 
  Compass, 
  Leaf, 
  DollarSign, 
  Maximize2,
  Check
} from 'lucide-react';
import { ProjectCustomer, BudgetTier, EngagementType } from '../types';

interface ArchitecturalBriefInputsPanelProps {
  project: ProjectCustomer;
  onGenerateWithInputs: (inputs: any) => void;
  isGenerating: boolean;
}

const AVAILABLE_STYLES = [
  'Contemporary Minimalist',
  'Biophilic Modernist',
  'Industrial Contemporary',
  'Modern Classic (Neoclassic)',
  'Tropical Modernism',
  'Japandi Warm Wood',
  'Art Deco Elegance'
];

export const ArchitecturalBriefInputsPanel: React.FC<ArchitecturalBriefInputsPanelProps> = ({
  project,
  onGenerateWithInputs,
  isGenerating
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Custom input state
  const [projectVision, setProjectVision] = useState(project.confirmedRequirements?.projectVision || '');
  const [builtUpArea, setBuiltUpArea] = useState<number>(project.builtUpAreaSqFt || 3400);
  const [siteArea, setSiteArea] = useState<number>(project.siteAreaSqFt || 3800);
  const [budgetTier, setBudgetTier] = useState<BudgetTier>(project.budgetTier);
  const [targetBudget, setTargetBudget] = useState<number>(project.targetBudget || 12000000);
  const [selectedStyles, setSelectedStyles] = useState<string[]>(
    project.confirmedRequirements?.stylePreferences || ['Contemporary Minimalist', 'Biophilic Modernist']
  );
  const [roomZonesText, setRoomZonesText] = useState(
    (project.confirmedRequirements?.roomZones || []).join('\n')
  );
  const [specialConstraints, setSpecialConstraints] = useState(
    project.confirmedRequirements?.specialConstraints || ''
  );

  const toggleStyle = (style: string) => {
    setSelectedStyles(prev => 
      prev.includes(style) 
        ? prev.filter(s => s !== style)
        : [...prev, style]
    );
  };

  const handleApplyAndSynthesize = () => {
    const parsedZones = roomZonesText
      .split('\n')
      .map(z => z.trim())
      .filter(Boolean);

    onGenerateWithInputs({
      builtUpAreaSqFt: Number(builtUpArea),
      siteAreaSqFt: Number(siteArea),
      budgetTier,
      targetBudget: Number(targetBudget),
      confirmedRequirements: {
        projectVision,
        roomZones: parsedZones.length > 0 ? parsedZones : project.confirmedRequirements?.roomZones || [],
        stylePreferences: selectedStyles,
        specialConstraints,
        dateConfirmed: new Date().toISOString().slice(0, 10)
      }
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden transition-all duration-200">
      <div 
        onClick={() => setIsExpanded(!isExpanded)}
        className="px-5 py-4 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-bold text-slate-900">
                Architectural Brief & Synthesis Directives
              </h3>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 font-mono">
                {builtUpArea.toLocaleString()} sq.ft • {selectedStyles.length} Styles Active
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Customize zoning program, aesthetic style vectors, sustainability constraints, and budget envelope before generation.
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            type="button"
            className="text-xs text-indigo-600 font-semibold hover:underline flex items-center space-x-1"
          >
            <span>{isExpanded ? 'Collapse Directives' : 'Tune Parameters'}</span>
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-5 border-t border-slate-100 bg-slate-50/50 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Project Vision */}
            <div className="md:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Core Project Architectural Vision
              </label>
              <textarea
                value={projectVision}
                onChange={e => setProjectVision(e.target.value)}
                rows={2}
                placeholder="Describe the architectural design intent, feeling, and space lifestyle..."
                className="w-full text-xs p-3 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>

            {/* Built-up Area & Target Budget */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Built-Up Area (sq.ft)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={builtUpArea}
                  onChange={e => setBuiltUpArea(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Target Budget Envelope (₹ INR)
              </label>
              <div className="relative">
                <input
                  type="number"
                  value={targetBudget}
                  onChange={e => setTargetBudget(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                />
              </div>
            </div>

            {/* Room Zones */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Required Spatial Zones (one per line)
              </label>
              <textarea
                value={roomZonesText}
                onChange={e => setRoomZonesText(e.target.value)}
                rows={3}
                placeholder="Living & Dining Great Room&#10;Master Bedroom Suite&#10;Executive Study"
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
              />
            </div>

            {/* Special Constraints */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Site & Technical Constraints
              </label>
              <textarea
                value={specialConstraints}
                onChange={e => setSpecialConstraints(e.target.value)}
                rows={3}
                placeholder="Quiet-hours restrictions, lift access rules, structural column locations..."
                className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
              />
            </div>
          </div>

          {/* Style Preference Tags */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Architectural Styles to Explore in Options
            </label>
            <div className="flex flex-wrap gap-2">
              {AVAILABLE_STYLES.map(style => {
                const isSelected = selectedStyles.includes(style);
                return (
                  <button
                    key={style}
                    type="button"
                    onClick={() => toggleStyle(style)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-1.5 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-white border border-slate-300 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {isSelected && <Check className="w-3 h-3" />}
                    <span>{style}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={() => setIsExpanded(false)}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={isGenerating}
              onClick={handleApplyAndSynthesize}
              className="px-4 py-2 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition-colors shadow-xs flex items-center space-x-2"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              <span>{isGenerating ? 'Synthesizing...' : 'Apply & Generate Concepts'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
