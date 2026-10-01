import React, { useState } from 'react';
import { 
  Camera, 
  Eye, 
  Check, 
  Sparkles, 
  Layers, 
  Maximize2, 
  Download, 
  Filter, 
  Compass, 
  Ruler, 
  Info, 
  ExternalLink,
  ChevronRight,
  Palette,
  CheckCircle2,
  SlidersHorizontal,
  FolderOpen
} from 'lucide-react';
import { FloorPlanReferenceImage, ExtractedRoomGeometry } from '../../types/floorplanSpatial';
import { 
  VILLA_253_ALL_REFERENCE_IMAGES, 
  REFERENCE_IMAGE_CATEGORIES 
} from '../../data/villa253ReferenceImages';

interface FloorPlanReferenceGalleryProps {
  currentRoom: ExtractedRoomGeometry;
  activeImageUrl: string;
  onApplyReferenceImage: (image: FloorPlanReferenceImage) => void;
  onPreviewImage?: (image: FloorPlanReferenceImage) => void;
  isCompactCarousel?: boolean;
}

export const FloorPlanReferenceGallery: React.FC<FloorPlanReferenceGalleryProps> = ({
  currentRoom,
  activeImageUrl,
  onApplyReferenceImage,
  onPreviewImage,
  isCompactCarousel = false
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [roomFilterOnly, setRoomFilterOnly] = useState<boolean>(false);
  const [selectedImageDetail, setSelectedImageDetail] = useState<FloorPlanReferenceImage | null>(null);

  // Filter images based on category and room filter
  const filteredImages = VILLA_253_ALL_REFERENCE_IMAGES.filter(img => {
    const matchesCategory = selectedCategory === 'ALL' || img.category === selectedCategory;
    const matchesRoom = !roomFilterOnly || img.applicableRooms.includes(currentRoom.id) || img.applicableRooms.includes('ALL');
    return matchesCategory && matchesRoom;
  });

  const handleDownload = (url: string, title: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title.replace(/\s+/g, '_').toLowerCase()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-lg text-white">
      {/* Gallery Header Bar */}
      <div className="p-3.5 border-b border-slate-800 bg-slate-950/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 flex items-center gap-1">
              <Camera className="w-3 h-3 text-amber-400" />
              <span>REFERENCE IMAGE LIBRARY ({VILLA_253_ALL_REFERENCE_IMAGES.length})</span>
            </span>
            <span className="text-[11px] text-slate-400 font-semibold">
              Applied to {currentRoom.name} &amp; Villa 253 Blueprint
            </span>
          </div>
          <h3 className="text-sm font-bold text-white mt-0.5">
            Fresh Architectural 3D Renders &amp; Interior Suites (Villa 253 Blueprint)
          </h3>
        </div>

        {/* Room Filter Toggle */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setRoomFilterOnly(!roomFilterOnly)}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              roomFilterOnly
                ? 'bg-purple-900/60 text-purple-200 border-purple-600/50 shadow-xs'
                : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
            }`}
          >
            <Filter className="w-3.5 h-3.5 text-purple-400" />
            <span>{roomFilterOnly ? `This Room Only (${currentRoom.name.split(' ')[0]})` : 'All Villa References'}</span>
          </button>
        </div>
      </div>

      {/* Category Pills Strip */}
      <div className="px-3.5 py-2 bg-slate-950/50 border-b border-slate-800/80 flex items-center gap-1.5 overflow-x-auto scrollbar-thin">
        {REFERENCE_IMAGE_CATEGORIES.map(cat => {
          const isSelected = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setSelectedCategory(cat.id)}
              className={`shrink-0 px-2.5 py-1 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
                isSelected
                  ? 'bg-amber-500 text-slate-950 font-bold shadow-xs'
                  : 'bg-slate-800/80 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/60'
              }`}
            >
              <span>{cat.label}</span>
              <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                isSelected ? 'bg-slate-950/20 text-slate-950 font-bold' : 'bg-slate-900 text-slate-400'
              }`}>
                {cat.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Image Cards Strip / Grid */}
      <div className={`p-3.5 ${
        isCompactCarousel 
          ? 'flex gap-3 overflow-x-auto scrollbar-thin pb-2' 
          : 'grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 max-h-[500px] overflow-y-auto'
      }`}>
        {filteredImages.map(img => {
          const isActive = activeImageUrl === img.imageUrl;
          return (
            <div
              key={img.id}
              onClick={() => setSelectedImageDetail(img)}
              className={`rounded-xl border overflow-hidden flex flex-col bg-slate-950/80 transition-all duration-200 group cursor-pointer ${
                isCompactCarousel ? 'w-64 shrink-0' : 'w-full'
              } ${
                isActive 
                  ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-lg' 
                  : 'border-slate-800 hover:border-slate-700 hover:bg-slate-900'
              }`}
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video bg-black overflow-hidden">
                <img
                  src={img.imageUrl}
                  alt={img.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Active Indicator Badge */}
                {isActive && (
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-emerald-600/90 backdrop-blur-sm text-white text-[10px] font-mono font-bold flex items-center gap-1 shadow-md border border-emerald-400/40">
                    <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                    <span>ACTIVE INTERIOR VIEW</span>
                  </div>
                )}

                {/* Camera Pin Indicator if camera hotspot exists */}
                {img.cameraHotspot && (
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500/90 backdrop-blur-sm text-slate-950 text-[9px] font-mono font-bold flex items-center gap-1 shadow-md">
                    <Camera className="w-2.5 h-2.5" />
                    <span>{img.cameraHotspot.cameraLabel.split(' ')[0]}</span>
                  </div>
                )}

                {/* Category Pill at bottom left */}
                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded bg-black/70 backdrop-blur-sm text-slate-300 text-[9px] font-mono border border-white/10 truncate max-w-[85%]">
                  {img.category.replace(/_/g, ' ')}
                </div>

                {/* Quick Action Overlay on hover */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplyReferenceImage(img);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1 shadow-md"
                    title="Apply this reference image as the primary 3D interior render"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Apply View</span>
                  </button>

                  <button
                    type="button"
                    onClick={(e) => handleDownload(img.imageUrl, img.title, e)}
                    className="p-1.5 rounded-lg bg-slate-900/90 hover:bg-black text-white text-xs border border-white/20 transition"
                    title="Download high-res image"
                  >
                    <Download className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Text Meta */}
              <div className="p-3 flex-1 flex flex-col justify-between">
                <div>
                  <h4 className="text-xs font-bold text-white group-hover:text-amber-300 transition-colors line-clamp-1">
                    {img.title}
                  </h4>
                  <p className="text-[10px] text-slate-400 line-clamp-2 mt-0.5 leading-relaxed">
                    {img.description}
                  </p>
                </div>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                  <span className="text-slate-500 font-mono truncate max-w-[120px]">
                    {img.cameraHotspot ? img.cameraHotspot.cameraLabel : img.cadDimensionReference?.split(':')[0] || 'Ref'}
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onApplyReferenceImage(img);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition flex items-center gap-1 cursor-pointer ${
                      isActive
                        ? 'bg-emerald-950 text-emerald-300 border border-emerald-800'
                        : 'bg-slate-800 hover:bg-amber-500 hover:text-slate-950 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    <span>{isActive ? 'Applied' : 'Apply to View'}</span>
                    <ChevronRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Detail Slideover / Modal for Inspecting Image Specifics */}
      {selectedImageDetail && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 md:p-6 animate-in fade-in duration-150">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white">
            {/* Header */}
            <div className="px-5 py-3.5 border-b border-slate-800 flex items-center justify-between gap-3 bg-slate-950/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    {selectedImageDetail.category.replace(/_/g, ' ')}
                  </span>
                  {selectedImageDetail.cameraHotspot && (
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-sky-900/60 text-sky-300 border border-sky-500/40 flex items-center gap-1">
                      <Camera className="w-3 h-3" />
                      <span>{selectedImageDetail.cameraHotspot.cameraLabel}</span>
                    </span>
                  )}
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedImageDetail.id}
                  </span>
                </div>
                <h3 className="text-base font-bold text-white mt-0.5">
                  {selectedImageDetail.title}
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    onApplyReferenceImage(selectedImageDetail);
                    setSelectedImageDetail(null);
                  }}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition flex items-center gap-1.5 shadow-md cursor-pointer"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Apply to Interior View</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => handleDownload(selectedImageDetail.imageUrl, selectedImageDetail.title, e)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer border border-slate-700"
                  title="Download Image"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedImageDetail(null)}
                  className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition cursor-pointer border border-slate-700"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
                {/* Image Display */}
                <div className="lg:col-span-7 space-y-2">
                  <div className="relative rounded-xl overflow-hidden border border-slate-700 bg-black aspect-video group shadow-lg">
                    <img
                      src={selectedImageDetail.imageUrl}
                      alt={selectedImageDetail.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded bg-black/80 backdrop-blur-sm text-white text-[11px] font-mono">
                      {selectedImageDetail.subtitle}
                    </div>
                  </div>
                </div>

                {/* Specifications & Blueprint Alignment */}
                <div className="lg:col-span-5 space-y-3">
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5 text-xs space-y-2">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Compass className="w-3.5 h-3.5" />
                      <span>Architectural Description &amp; Intent:</span>
                    </div>
                    <p className="text-slate-300 text-[11px] leading-relaxed">
                      {selectedImageDetail.description}
                    </p>
                  </div>

                  {/* Camera Target Details */}
                  {selectedImageDetail.cameraHotspot && (
                    <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                      <div className="font-bold text-sky-300 flex items-center gap-1.5">
                        <Camera className="w-3.5 h-3.5" />
                        <span>Floor Plan Camera Position:</span>
                      </div>
                      <div className="text-[11px] text-slate-300">
                        <strong>Viewing Angle:</strong> {selectedImageDetail.cameraHotspot.angleDegrees}° ({selectedImageDetail.cameraHotspot.fieldOfViewDegrees}° FOV)
                      </div>
                      <div className="text-[11px] text-slate-300">
                        <strong>Target:</strong> {selectedImageDetail.cameraHotspot.viewTargetName}
                      </div>
                    </div>
                  )}

                  {/* Key Design Elements */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="font-bold text-emerald-300 flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Key Architectural Elements:</span>
                    </div>
                    <ul className="space-y-1 text-[11px] text-slate-300 list-disc list-inside">
                      {selectedImageDetail.keyDesignElements.map((el, i) => (
                        <li key={i}>{el}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Materials Referenced */}
                  <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3 text-xs space-y-1.5">
                    <div className="font-bold text-purple-300 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      <span>Materials Referenced:</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedImageDetail.materialsReferenced.map((mat, i) => (
                        <span key={i} className="px-2 py-0.5 rounded bg-slate-800 text-slate-200 text-[10px] font-medium border border-slate-700">
                          {mat}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* CAD Reference */}
                  {selectedImageDetail.cadDimensionReference && (
                    <div className="text-[10px] text-slate-400 font-mono bg-slate-950/40 p-2 rounded-lg border border-slate-800">
                      <strong>CAD Reference:</strong> {selectedImageDetail.cadDimensionReference}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-5 py-3 border-t border-slate-800 bg-slate-950/70 flex items-center justify-between text-xs">
              <span className="text-slate-400 text-[11px]">
                Clicking &quot;Apply to Interior View&quot; switches the primary Step 2 render and synchronizes verified room finishes.
              </span>
              <button
                type="button"
                onClick={() => {
                  onApplyReferenceImage(selectedImageDetail);
                  setSelectedImageDetail(null);
                }}
                className="px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs transition flex items-center gap-1.5 shadow-md cursor-pointer"
              >
                <Check className="w-4 h-4" />
                <span>Apply as Active Interior View</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
