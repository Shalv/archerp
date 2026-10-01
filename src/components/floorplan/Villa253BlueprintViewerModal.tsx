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
  Info,
  Download,
  FileCode2
} from 'lucide-react';
import { 
  VILLA_253_SCHEDULE, 
  Villa253DoorWindowScheduleItem,
  VILLA_253_ROOMS
} from '../../data/villa253BlueprintData';
import { Villa253VectorCadPreview } from './Villa253VectorCadPreview';
import {
  VILLA_253_CAD_LAYERS,
  triggerDownloadVilla253Dxf,
  triggerDownloadVilla253Pdf
} from '../../utils/villa253CadDataAndDxf';

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
  const [activeTab, setActiveTab] = useState<'GROUND' | 'FIRST' | 'SCHEDULE' | 'SECTIONS' | 'CAD_DXF' | 'PDF_DOCS'>('GROUND');
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

          <div className="flex items-center gap-2">
            <button
              onClick={triggerDownloadVilla253Dxf}
              className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              title="Download Editable AutoCAD DXF (8 Layers)"
            >
              <FileCode2 className="w-3.5 h-3.5" />
              <span>Download Editable DXF</span>
            </button>
            <button
              onClick={triggerDownloadVilla253Pdf}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
              title="Download Authoritative Villa 253 Wall Marking R0 PDF"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Source R0 PDF</span>
            </button>
            <button 
              onClick={onClose}
              className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
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
            <button
              onClick={() => setActiveTab('CAD_DXF')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'CAD_DXF'
                  ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/20'
                  : 'text-emerald-300 hover:bg-slate-800 hover:text-white border border-emerald-500/30'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              8-Layer Vector CAD &amp; DXF
            </button>
            <button
              onClick={() => setActiveTab('PDF_DOCS')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                activeTab === 'PDF_DOCS'
                  ? 'bg-blue-500 text-white font-bold shadow-md shadow-blue-500/20'
                  : 'text-blue-300 hover:bg-slate-800 hover:text-white border border-blue-500/30'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              Source PDF &amp; CAD Logic Docs
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

          {/* TAB 5: 8-LAYER VECTOR CAD & EDITABLE DXF */}
          {activeTab === 'CAD_DXF' && (
            <div className="space-y-4">
              <Villa253VectorCadPreview
                roomId="ROOM-V253-LIV-01"
                showLayerControls={true}
                showDownloadBar={true}
                onSelectRoom={onSelectRoom}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {VILLA_253_CAD_LAYERS.map(layer => (
                  <div
                    key={layer.id}
                    className="p-3 rounded-xl bg-slate-950/90 border border-slate-800 flex flex-col justify-between"
                  >
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-mono text-xs font-bold text-white flex items-center gap-1.5">
                        <span
                          className="w-2.5 h-2.5 rounded-full inline-block"
                          style={{ backgroundColor: layer.colorHex }}
                        />
                        {layer.dxfLayerName}
                      </span>
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-900 text-slate-400">
                        ACI {layer.aciColor}
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-200">{layer.label}</div>
                    <p className="text-[11px] text-slate-400 mt-1">{layer.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: SOURCE PDF & CAD/IMAGE LOGIC DOCUMENTATION */}
          {activeTab === 'PDF_DOCS' && (
            <div className="space-y-5">
              {/* Important CAD Authority Notice Banner */}
              <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 text-amber-100 space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2">
                    <Info className="w-4 h-4" />
                    Important CAD &amp; Construction Authority Distinction
                  </h3>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={triggerDownloadVilla253Dxf}
                      className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <FileCode2 className="w-3.5 h-3.5" />
                      Download Villa253_FloorPlan_Editable_R0.dxf
                    </button>
                    <button
                      onClick={triggerDownloadVilla253Pdf}
                      className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      Download Source R0 PDF
                    </button>
                  </div>
                </div>
                <p className="text-xs leading-relaxed text-amber-100/90">
                  The editable DXF (<code className="text-amber-300 font-mono">Villa253_FloorPlan_Editable_R0.dxf</code>) is a <strong>dimension-driven working CAD reconstruction</strong> from the supplied Villa 253 Wall Marking Drawing R0 (dated 10-10-24) with 8 separate layers (Walls, Doors, Windows, Staircase, Decks/Balconies, Dimensions, Text, Notes) rather than pretending a raster image is a CAD file. It is not a certified construction DWG — the <strong>original architectural PDF remains the construction authority</strong> and the DXF should be verified by the project architect/CAD operator before site execution.
                </p>
              </div>

              {/* Embedded PDF Preview + Logic Summary */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-slate-950 border border-slate-800 rounded-xl overflow-hidden flex flex-col">
                  <div className="px-4 py-2.5 bg-slate-900 border-b border-slate-800 flex items-center justify-between">
                    <span className="text-xs font-bold text-white flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400" />
                      Authoritative Source PDF (VILLA_253_WALL_MARKING_10_10_24_REV0.pdf)
                    </span>
                    <a
                      href="/api/cad/villa253.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-blue-400 hover:underline flex items-center gap-1"
                    >
                      Open PDF <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <iframe
                    src="/api/cad/villa253.pdf"
                    title="Villa 253 Wall Marking Drawing R0 PDF"
                    className="w-full h-[420px] bg-slate-900"
                  />
                </div>

                <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3 overflow-y-auto max-h-[465px]">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                    Summary of CAD &amp; Room Image Logic Fixes Applied
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-300">
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Removed Wildcard ALL Image Mapping:</strong> Eliminated the <code className="text-amber-300">ALL</code> room tag that caused the same exterior/living room visuals to repeat across different rooms.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Corrected Canonical Room IDs:</strong> Synchronized <code className="text-amber-300">ROOM-V253-LIV-01</code> (25&apos;4&quot;×19&apos;), <code className="text-amber-300">ROOM-V253-BED1-01</code> (14&apos;0&quot;×19&apos;), <code className="text-amber-300">ROOM-V253-BED2-01</code> (18&apos;11&quot;×19&apos;), <code className="text-amber-300">ROOM-V253-BED3-01</code> (20&apos;8&quot;×19&apos;), <code className="text-amber-300">ROOM-V253-KIT-01</code> (14&apos;6&quot;×9&apos;), <code className="text-amber-300">ROOM-V253-STAIR-01</code> (7&apos;6&quot;×19&apos;), and <code className="text-amber-300">ROOM-V253-GAZEBO-01</code> (24&apos;×18&apos;).</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Strict Image De-Duplication &amp; Room-Specific Fallback:</strong> Added URL de-duplication and removed the fallback that displayed a living-room render for bedrooms, kitchen, or staircase.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Source Floor-Plan &amp; Dimension-Driven Renders:</strong> Interior generation prompts and room filenames are now deterministically anchored to the Villa 253 R0 wall-marking dimensions and schedule marks.</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span><strong>Vector Floor-Plan Preview &amp; 8-Layer Editable DXF:</strong> Replaced misleading raster &ldquo;CAD&rdquo; thumbnails with a true vector floor-plan preview and downloadable AutoCAD DXF with 8 architectural layers.</span>
                    </li>
                  </ul>
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
