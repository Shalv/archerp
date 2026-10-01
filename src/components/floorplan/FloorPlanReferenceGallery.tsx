import React, { useState, useMemo } from 'react';
import {
  Sparkles,
  Maximize2,
  CheckCircle2,
  Compass,
  Layers,
  Ruler,
  Eye,
  X,
  ArrowUpRight,
  Building2,
  ShieldCheck
} from 'lucide-react';
import {
  VILLA_253_REFERENCE_IMAGES,
  Villa253ReferenceImage,
  getVilla253ImagesByRoom,
  deduplicateReferenceImages
} from '../../data/villa253ReferenceImages';

interface FloorPlanReferenceGalleryProps {
  selectedRoomId?: string;
  onSelectRoom?: (roomId: string) => void;
  onApplyReferenceStyle?: (image: Villa253ReferenceImage) => void;
  compact?: boolean;
}

export const FloorPlanReferenceGallery: React.FC<FloorPlanReferenceGalleryProps> = ({
  selectedRoomId,
  onSelectRoom,
  onApplyReferenceStyle,
  compact = false
}) => {
  const [activeFilter, setActiveFilter] = useState<string>(selectedRoomId || 'ALL');
  const [lightboxImage, setLightboxImage] = useState<Villa253ReferenceImage | null>(null);

  // Sync filter when parent room selection changes
  React.useEffect(() => {
    if (selectedRoomId) {
      setActiveFilter(selectedRoomId);
    }
  }, [selectedRoomId]);

  // De-duplicated images strictly filtered by room (no 'ALL' bleed into individual rooms)
  const displayedImages = useMemo(() => {
    if (!activeFilter || activeFilter === 'ALL') {
      return deduplicateReferenceImages(VILLA_253_REFERENCE_IMAGES);
    }
    return getVilla253ImagesByRoom(activeFilter);
  }, [activeFilter]);

  const roomFilters = [
    { id: 'ALL', label: 'All Villa 253 Rooms (9)' },
    { id: 'ROOM-V253-LIV-01', label: 'Living & Dining (25\'4"×19\')' },
    { id: 'ROOM-V253-BED1-01', label: 'Bedroom 1 Master (14\'×19\')' },
    { id: 'ROOM-V253-BED2-01', label: 'Bedroom 2 Suite (18\'11"×19\')' },
    { id: 'ROOM-V253-BED3-01', label: 'Bedroom 3 1st Flr (20\'8"×19\')' },
    { id: 'ROOM-V253-KIT-01', label: 'Kitchen & Utility (14\'6"×9\')' },
    { id: 'ROOM-V253-STAIR-01', label: 'Staircase Core (7\'6"×19\')' },
    { id: 'ROOM-V253-GAZEBO-01', label: 'Roof Gazebo (24\'×18\')' },
    { id: 'EXTERIOR-FACADE', label: 'North Facade & Deck' }
  ];

  return (
    <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-sm overflow-hidden">
      {/* Header Banner */}
      <div className="px-4 py-3 bg-gradient-to-r from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-[#F59E0B]/20 border border-[#F59E0B]/40 flex items-center justify-center text-[#FBBF24]">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-white">
                Villa 253 — Verified Room-Specific Architectural Visuals
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#10B981]/20 text-[#34D399] border border-[#10B981]/30 flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> R0 Wall-Marking Calibrated
              </span>
            </div>
            <p className="text-[11px] text-[#94A3B8]">
              North-Facing 24-Type 3BHK Villa with Roof Gazebo • Strictly mapped &amp; de-duplicated per room ID
            </p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 bg-[#1E293B] p-1 rounded-lg border border-[#334155] overflow-x-auto max-w-full">
          {roomFilters.map(filter => (
            <button
              key={filter.id}
              onClick={() => {
                setActiveFilter(filter.id);
                if (filter.id !== 'ALL' && onSelectRoom) {
                  onSelectRoom(filter.id);
                }
              }}
              className={`px-2.5 py-1 rounded-md text-[10px] font-semibold whitespace-nowrap transition-all ${
                activeFilter === filter.id
                  ? 'bg-[#F59E0B] text-[#0F172A] shadow-sm font-bold'
                  : 'text-[#CBD5E1] hover:text-white hover:bg-white/5'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Image Grid */}
      <div className={`p-4 grid gap-4 ${compact ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'}`}>
        {displayedImages.map(item => (
          <div
            key={item.id}
            className="group rounded-xl border border-[#E2E8F0] bg-[#F8FAFC] overflow-hidden hover:border-[#0078D4] hover:shadow-md transition-all flex flex-col"
          >
            {/* Image Container */}
            <div
              className="relative h-48 w-full bg-[#0F172A] overflow-hidden cursor-pointer"
              onClick={() => setLightboxImage(item)}
            >
              <img
                src={item.imageUrl}
                alt={item.title}
                onError={(e) => {
                  const target = e.currentTarget;
                  if (target.src !== window.location.origin + item.fallbackUrl) {
                    target.src = item.fallbackUrl;
                  }
                }}
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F172A]/90 via-[#0F172A]/20 to-transparent" />

              {/* Top Badges */}
              <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2">
                <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-[#0F172A]/80 backdrop-blur-md text-[#FBBF24] border border-[#F59E0B]/40">
                  {item.styleTag}
                </span>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setLightboxImage(item);
                  }}
                  className="p-1.5 rounded-lg bg-black/60 text-white hover:bg-[#0078D4] transition-colors"
                  title="Inspect High-Resolution Render"
                >
                  <Maximize2 className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Bottom Overlay Info */}
              <div className="absolute bottom-2.5 left-3 right-3 text-white">
                <div className="flex items-center gap-1.5 text-[10px] font-mono text-[#38BDF8] mb-0.5">
                  <Ruler className="w-3 h-3" />
                  <span>{item.dimensions}</span>
                </div>
                <h4 className="text-xs font-bold leading-snug text-white line-clamp-1">
                  {item.title}
                </h4>
              </div>
            </div>

            {/* Details Body */}
            <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5 bg-white">
              <div className="space-y-1.5">
                <p className="text-[11px] font-semibold text-[#475569]">
                  {item.subtitle}
                </p>
                <ul className="space-y-1">
                  {item.architecturalNotes.slice(0, 2).map((note, idx) => (
                    <li key={idx} className="text-[10px] text-[#64748B] flex items-start gap-1.5">
                      <CheckCircle2 className="w-3 h-3 text-[#10B981] shrink-0 mt-0.5" />
                      <span className="line-clamp-2">{note}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-2 border-t border-[#F1F5F9] flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => setLightboxImage(item)}
                  className="text-[11px] font-semibold text-[#0078D4] hover:underline flex items-center gap-1"
                >
                  <Eye className="w-3.5 h-3.5" /> View Specs &amp; Finishes
                </button>

                {onApplyReferenceStyle && (
                  <button
                    type="button"
                    onClick={() => onApplyReferenceStyle(item)}
                    className="px-2.5 py-1 rounded-md bg-[#0F172A] hover:bg-[#0078D4] text-white text-[10px] font-semibold flex items-center gap-1 transition-colors"
                  >
                    <Sparkles className="w-3 h-3 text-[#FBBF24]" />
                    Sync Room View
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setLightboxImage(null)}
        >
          <div
            className="bg-[#0F172A] border border-[#334155] rounded-2xl max-w-5xl w-full overflow-hidden shadow-2xl flex flex-col lg:flex-row max-h-[90vh]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Image Pane */}
            <div className="lg:w-2/3 bg-black flex items-center justify-center relative min-h-[320px]">
              <img
                src={lightboxImage.imageUrl}
                alt={lightboxImage.title}
                className="w-full h-full max-h-[80vh] object-contain"
              />
              <span className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold bg-black/75 text-[#FBBF24] border border-[#F59E0B]/40">
                {lightboxImage.styleTag} • {lightboxImage.roomId}
              </span>
            </div>

            {/* Right Architectural Dossier Pane */}
            <div className="lg:w-1/3 p-6 text-white flex flex-col justify-between overflow-y-auto space-y-5">
              <div className="space-y-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="text-[10px] font-mono uppercase tracking-widest text-[#38BDF8]">
                      VILLA 253 • {lightboxImage.roomName}
                    </span>
                    <h3 className="text-base font-bold text-white mt-1">
                      {lightboxImage.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setLightboxImage(null)}
                    className="p-1.5 rounded-lg bg-[#1E293B] text-[#94A3B8] hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="p-3 rounded-xl bg-[#1E293B]/90 border border-[#334155]">
                  <div className="text-[10px] uppercase tracking-wider text-[#94A3B8] mb-1">
                    Wall-Marking R0 Dimensions (10-10-24)
                  </div>
                  <div className="text-xs font-mono font-bold text-[#34D399] flex items-center gap-2">
                    <Compass className="w-4 h-4 text-[#FBBF24]" />
                    {lightboxImage.dimensions}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-2 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-[#38BDF8]" />
                    Architectural Alignment Notes
                  </h4>
                  <ul className="space-y-2">
                    {lightboxImage.architecturalNotes.map((note, idx) => (
                      <li key={idx} className="text-xs text-[#94A3B8] flex items-start gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        <span>{note}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#CBD5E1] mb-2 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#FBBF24]" />
                    Specified Finishes &amp; BOQ Elements
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {lightboxImage.materialHighlights.map((mat, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 rounded-md text-[11px] bg-[#1E293B] text-[#E2E8F0] border border-[#334155]"
                      >
                        {mat}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-[#334155] flex items-center justify-end gap-2">
                {onApplyReferenceStyle && (
                  <button
                    type="button"
                    onClick={() => {
                      onApplyReferenceStyle(lightboxImage);
                      setLightboxImage(null);
                    }}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#0078D4] hover:bg-[#106EBE] text-white text-xs font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
                  >
                    <ArrowUpRight className="w-4 h-4" />
                    Load Room in Spatial Studio
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
