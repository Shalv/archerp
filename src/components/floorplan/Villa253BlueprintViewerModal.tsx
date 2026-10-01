import React, { useState } from 'react';
import { 
  Building2, 
  X, 
  Layers, 
  Compass, 
  Maximize2, 
  Ruler, 
  CheckCircle2, 
  DoorOpen, 
  FileText, 
  ExternalLink,
  Table,
  ArrowRight,
  Eye,
  Info
} from 'lucide-react';
import { 
  VILLA_253_SCHEDULE, 
  Villa253DoorWindowScheduleItem,
  VILLA_253_ROOMS
} from '../../data/villa253BlueprintData';

interface Villa253BlueprintViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRoom?: (roomId: string) => void;
}

export const Villa253BlueprintViewerModal: React.FC<Villa253BlueprintViewerModalProps> = ({
  isOpen,
  onClose,
  onSelectRoom
}) => {
  const [activeTab, setActiveTab] = useState<'GROUND' | 'FIRST' | 'SCHEDULE' | 'SECTIONS'>('GROUND');
  const [filterType, setFilterType] = useState<string>('ALL');

  if (!isOpen) return null;

  const filteredSchedule = VILLA_253_SCHEDULE.filter(item => {
    if (filterType === 'ALL') return true;
    if (filterType === 'GROUND') return item.floor === 'GROUND';
    if (filterType === 'FIRST') return item.floor === 'FIRST';
    if (filterType === 'SLIDING') return item.type === 'SLIDING_DOOR';
    if (filterType === 'WOODEN') return item.type === 'WOODEN_DOOR';
    if (filterType === 'WINDOWS') return item.type === 'WINDOW' || item.type === 'FIXED_GLASS';
    return true;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-sm p-3 sm:p-6 overflow-y-auto">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[92vh] flex flex-col overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="px-5 py-4 bg-slate-950/90 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  VILLA 253 • Architectural Blueprint & Specifications
                </h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700/60">
                  REV : 0 (10-10-24)
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-300 border border-blue-700/60">
                  NORTH FACING
                </span>
              </div>
              <p className="text-xs text-slate-400">
                24 TYPE - 3 BEDROOM WITH ROOF GAZEBO • Outer Footprint: 85'-5" × 20'-4" • Total Built Area: ~2,840 sq.ft
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

        {/* Navigation Tabs */}
        <div className="px-5 py-2.5 bg-slate-950/40 border-b border-slate-800 flex items-center justify-between shrink-0 overflow-x-auto gap-2">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('GROUND')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'GROUND' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Ground Floor Plan (Living, Master 1, Bed 2, Decks)
            </button>
            <button
              onClick={() => setActiveTab('FIRST')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'FIRST' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              First Floor Plan (Bedroom 3, Balconies)
            </button>
            <button
              onClick={() => setActiveTab('SECTIONS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                activeTab === 'SECTIONS' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              Section & Elevation (Roof Gazebo, BB', Rear)
            </button>
            <button
              onClick={() => setActiveTab('SCHEDULE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'SCHEDULE' 
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                  : 'text-slate-300 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <Table className="w-3.5 h-3.5" />
              Door & Window Schedule ({VILLA_253_SCHEDULE.length})
            </button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-slate-400 font-mono">
            <span className="flex items-center gap-1">
              <Compass className="w-3.5 h-3.5 text-amber-400" />
              N ↑ Facing
            </span>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 min-h-0 overflow-y-auto p-4 sm:p-5">
          {activeTab === 'GROUND' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    GROUND FLOOR PLAN • Key Spatial Zones & Openings
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Footprint: 85'-5" (Outer to Outer) × 20'-4"
                  </span>
                </div>

                {/* Ground floor rooms cards with direct select action */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  {VILLA_253_ROOMS.filter(r => r.id.includes('LIV') || r.id.includes('BED1') || r.id.includes('BED2') || r.id.includes('KIT') || r.id.includes('STAIR')).map((room) => (
                    <div 
                      key={room.id}
                      className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-xl p-3.5 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <h4 className="text-xs font-bold text-white">{room.name}</h4>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-amber-300">
                            {room.carpetAreaSqFt} sq.ft
                          </span>
                        </div>
                        <p className="text-[11px] font-mono text-emerald-400 mb-2">
                          {room.lengthFt.toFixed(1)}' × {room.widthFt.toFixed(1)}' (Height: {room.heightFt}' to beam)
                        </p>
                        <p className="text-[11px] text-slate-400 line-clamp-3 leading-relaxed mb-3">
                          {room.designerNotes}
                        </p>
                      </div>

                      <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500">
                          {room.doors.length} Doors • {room.windows.length} Glazings
                        </span>
                        {onSelectRoom && (
                          <button
                            onClick={() => {
                              onSelectRoom(room.id);
                              onClose();
                            }}
                            className="px-2.5 py-1 rounded bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-medium transition-all flex items-center gap-1"
                          >
                            <span>Design Room</span>
                            <ArrowRight className="w-3 h-3" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Blueprint Exterior & Deck Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <div className="text-xs font-semibold text-amber-400 mb-1">North Front Deck</div>
                  <div className="text-sm font-mono font-bold text-white mb-1">57'-2" × 9'-6"</div>
                  <p className="text-[11px] text-slate-400">
                    Connects directly to the Living & Dining Room via 27ft wide aluminum sliding system SD1.
                  </p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <div className="text-xs font-semibold text-amber-400 mb-1">Outdoor Bar Unit Deck</div>
                  <div className="text-sm font-mono font-bold text-white mb-1">14'-0" × 30'-10"</div>
                  <p className="text-[11px] text-slate-400">
                    Dedicated outdoor entertainment bar deck opening directly from Bedroom 2 suite via sliding door SD6.
                  </p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <div className="text-xs font-semibold text-amber-400 mb-1">Rear Living Deck</div>
                  <div className="text-sm font-mono font-bold text-white mb-1">13'-0" × 9'-6"</div>
                  <p className="text-[11px] text-slate-400">
                    Private shaded patio deck accessed via sliding door SD5 for rear cross-breeze and garden lounge.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'FIRST' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <div className="flex items-center justify-between gap-2 mb-3">
                  <h3 className="text-sm font-bold text-white flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                    FIRST FLOOR PLAN • Bedroom 3 Suite, Balconies & Gazebo Link
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    Span: 30'-2" × 20'-4"
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {VILLA_253_ROOMS.filter(r => r.id.includes('BED3') || r.id.includes('GAZEBO')).map((room) => (
                    <div 
                      key={room.id}
                      className="bg-slate-900/90 border border-slate-800 hover:border-amber-500/50 rounded-xl p-4 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-start justify-between gap-2 mb-2">
                          <h4 className="text-sm font-bold text-white">{room.name}</h4>
                          <span className="px-2 py-0.5 rounded text-[11px] font-mono bg-slate-800 text-amber-300">
                            {room.carpetAreaSqFt} sq.ft
                          </span>
                        </div>
                        <p className="text-xs font-mono text-emerald-400 mb-2">
                          {room.lengthFt.toFixed(1)}' × {room.widthFt.toFixed(1)}' (Clear Height: {room.heightFt}')
                        </p>
                        <p className="text-xs text-slate-400 leading-relaxed mb-4">
                          {room.designerNotes}
                        </p>
                      </div>

                      <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
                        <span className="text-xs text-slate-500">
                          {room.id.includes('GAZEBO') ? 'Pitched Timber Structure' : 'Ensuite Toilet 3 (9\'9" × 9\'2")'}
                        </span>
                        {onSelectRoom && (
                          <button
                            onClick={() => {
                              onSelectRoom(room.id);
                              onClose();
                            }}
                            className="px-3 py-1.5 rounded bg-amber-500/10 hover:bg-amber-500 text-amber-300 hover:text-slate-950 text-xs font-medium transition-all flex items-center gap-1.5"
                          >
                            <span>Design Room</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* First Floor Balcony Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <div className="text-xs font-semibold text-amber-400 mb-1">Front North Balcony</div>
                  <div className="text-sm font-mono font-bold text-white mb-1">24'-4" × 4'-0"</div>
                  <p className="text-[11px] text-slate-400">
                    Extended viewing balcony opening via sliding doors SD1A (12ft) and SD2A (10ft).
                  </p>
                </div>
                <div className="bg-slate-950/60 border border-slate-800/80 rounded-xl p-3">
                  <div className="text-xs font-semibold text-amber-400 mb-1">Side Balcony Access</div>
                  <div className="text-sm font-mono font-bold text-white mb-1">14'-10" × 4'-0"</div>
                  <p className="text-[11px] text-slate-400">
                    Connecting gallery from Bedroom 3 towards the upper staircase landing and gazebo walkway.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SECTIONS' && (
            <div className="space-y-4">
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl p-4">
                <h3 className="text-sm font-bold text-white mb-2 flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                  SECTION BB' & ELEVATIONS • Roof Gazebo & Architectural Massing
                </h3>
                <p className="text-xs text-slate-400 mb-4">
                  From Blueprint Page 2-2: Displays the iconic triangular pitched Roof Gazebo with timber rafters, ridge beam, and plinth-to-beam structural heights.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                      Section BB' - Roof Gazebo Pavilion
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Pitched Roof Gazebo:</strong> Triangular timber roof structure anchored to upper concrete slab with timber rafters.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Ridge Beam Height:</strong> 12'-9" above First Floor Level providing expansive airy canopy.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Plinth Level:</strong> 1'-6" above natural ground level with damp-proof coursing.</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-slate-900 border border-slate-800 rounded-xl p-4">
                    <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider mb-2">
                      Rear Elevation & Clerestory Openings
                    </h4>
                    <ul className="space-y-2 text-xs text-slate-300">
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Clerestory Fixed Glass (FW1):</strong> 15'9" × 1'3" fixed glass with wooden beading above roof beam for indirect sky lighting.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Staircase Tower (W2 & W2A):</strong> Full-height vertical glazing highlighting the double-flight dogleg staircase.</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span><strong>Horizontal Bay Articulation:</strong> 35'-9" + 27'-7" + 22'-1" structural modulation.</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'SCHEDULE' && (
            <div className="space-y-3">
              {/* Filter controls */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs text-slate-400">Filter Schedule:</span>
                {[
                  { key: 'ALL', label: 'All Items' },
                  { key: 'GROUND', label: 'Ground Floor' },
                  { key: 'FIRST', label: 'First Floor' },
                  { key: 'SLIDING', label: 'Sliding Doors (SD)' },
                  { key: 'WOODEN', label: 'Wooden Doors (D)' },
                  { key: 'WINDOWS', label: 'Windows & Glazing (W/FW)' }
                ].map(f => (
                  <button
                    key={f.key}
                    onClick={() => setFilterType(f.key)}
                    className={`px-2.5 py-1 rounded text-xs transition-colors ${
                      filterType === f.key 
                        ? 'bg-amber-500 text-slate-950 font-bold' 
                        : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Table */}
              <div className="bg-slate-950/80 border border-slate-800 rounded-xl overflow-hidden shadow-lg">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-mono text-[11px]">
                        <th className="py-2.5 px-3">SL</th>
                        <th className="py-2.5 px-3">MARK</th>
                        <th className="py-2.5 px-3">FLOOR</th>
                        <th className="py-2.5 px-3">TYPE</th>
                        <th className="py-2.5 px-3">SILL HT</th>
                        <th className="py-2.5 px-3">LINTEL HT</th>
                        <th className="py-2.5 px-3">SIZE (L×H)</th>
                        <th className="py-2.5 px-3">LOCATION</th>
                        <th className="py-2.5 px-3 text-center">QTY</th>
                        <th className="py-2.5 px-3">SPEC / REMARKS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 font-mono">
                      {filteredSchedule.map((item) => (
                        <tr key={`${item.code}-${item.slNo}`} className="hover:bg-slate-900/50 transition-colors">
                          <td className="py-2 px-3 text-slate-500">{item.slNo}</td>
                          <td className="py-2 px-3 font-bold text-amber-400">{item.code}</td>
                          <td className="py-2 px-3 text-slate-300">{item.floor}</td>
                          <td className="py-2 px-3">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] ${
                              item.type === 'SLIDING_DOOR' 
                                ? 'bg-blue-950 text-blue-300 border border-blue-800/60' 
                                : item.type === 'WOODEN_DOOR' 
                                ? 'bg-amber-950 text-amber-300 border border-amber-800/60' 
                                : 'bg-emerald-950 text-emerald-300 border border-emerald-800/60'
                            }`}>
                              {item.type.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-2 px-3 text-slate-400">{item.sillHeight}</td>
                          <td className="py-2 px-3 text-slate-400">{item.lintelHeight}</td>
                          <td className="py-2 px-3 font-semibold text-white">{item.sizeLxH}</td>
                          <td className="py-2 px-3 text-slate-300 font-sans">{item.location}</td>
                          <td className="py-2 px-3 text-center font-bold text-white">{item.qty}</td>
                          <td className="py-2 px-3 text-slate-400 font-sans text-[11px]">{item.remarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 bg-slate-950/90 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-amber-400" />
            <span>Extracted verbatim from Villa 253 Architectural Blueprint (Page 1-2 & 2-2)</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors"
          >
            Close Viewer
          </button>
        </div>

      </div>
    </div>
  );
};
