import React, { useState } from 'react';
import { 
  Ruler, 
  DoorOpen, 
  Sun, 
  CheckCircle2, 
  AlertTriangle, 
  Info, 
  Maximize2, 
  Compass,
  Layers,
  Sparkles,
  Camera,
  Eye,
  ArrowUpRight
} from 'lucide-react';
import { 
  ExtractedRoomGeometry, 
  FurnitureLayoutOption, 
  FurnitureLayoutItem,
  FloorPlanReferenceImage 
} from '../../types/floorplanSpatial';

interface InteractiveRoomPlanCanvasProps {
  room: ExtractedRoomGeometry;
  layout: FurnitureLayoutOption;
  selectedFurnitureId?: string | null;
  onSelectFurniture?: (item: FurnitureLayoutItem | null) => void;
  showCirculationCorridors?: boolean;
  referenceImages?: FloorPlanReferenceImage[];
  activeReferenceImageId?: string | null;
  onSelectReferenceImage?: (image: FloorPlanReferenceImage) => void;
}

export const InteractiveRoomPlanCanvas: React.FC<InteractiveRoomPlanCanvasProps> = ({
  room,
  layout,
  selectedFurnitureId,
  onSelectFurniture,
  showCirculationCorridors = true,
  referenceImages = [],
  activeReferenceImageId,
  onSelectReferenceImage
}) => {
  const [hoveredFurniture, setHoveredFurniture] = useState<FurnitureLayoutItem | null>(null);
  const [hoveredHotspot, setHoveredHotspot] = useState<FloorPlanReferenceImage | null>(null);
  const [showCameras, setShowCameras] = useState<boolean>(true);

  // SVG canvas dimensions
  const canvasWidth = 600;
  const canvasHeight = 440;
  const padding = 50;

  // Scale feet to SVG coordinates
  const scaleX = (canvasWidth - padding * 2) / (room.lengthFt || 20);
  const scaleY = (canvasHeight - padding * 2) / (room.widthFt || 12);
  const scale = Math.min(scaleX, scaleY);

  const roomSvgWidth = room.lengthFt * scale;
  const roomSvgHeight = room.widthFt * scale;
  const offsetX = (canvasWidth - roomSvgWidth) / 2;
  const offsetY = (canvasHeight - roomSvgHeight) / 2;

  // Filter camera hotspots that apply to this room or ALL
  const roomHotspots = referenceImages.filter(
    img => (img.applicableRooms.includes(room.id) || img.applicableRooms.includes('ALL')) && !!img.cameraHotspot
  );

  // Helper to get furniture color by category
  const getCategoryStyles = (category: string) => {
    switch (category) {
      case 'SEATING':
        return { fill: '#0284C7', stroke: '#0369A1', text: 'text-sky-400' };
      case 'STORAGE':
        return { fill: '#D97706', stroke: '#B45309', text: 'text-amber-400' };
      case 'WORK_DESK':
        return { fill: '#8B5CF6', stroke: '#6D28D9', text: 'text-purple-400' };
      case 'DINING':
        return { fill: '#10B981', stroke: '#047857', text: 'text-emerald-400' };
      case 'BED':
        return { fill: '#EC4899', stroke: '#BE185D', text: 'text-pink-400' };
      default:
        return { fill: '#64748B', stroke: '#475569', text: 'text-slate-400' };
    }
  };

  return (
    <div className="relative bg-slate-950 border border-slate-800 rounded-xl overflow-hidden shadow-lg select-none">
      {/* Canvas Header Bar */}
      <div className="bg-slate-900/90 px-3.5 py-2.5 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono font-bold text-white tracking-wide">
            {room.name} • {room.lengthFt}'-0" × {room.widthFt}'-0" ({room.carpetAreaSqFt} sq.ft)
          </span>
          <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-900/60 text-blue-300 border border-blue-700/50">
            SCALE: 1:50 VERIFIED
          </span>
        </div>

        <div className="flex items-center gap-2 text-[11px]">
          {/* Camera Viewpoints Toggle */}
          {roomHotspots.length > 0 && (
            <button
              type="button"
              onClick={() => setShowCameras(!showCameras)}
              className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1.5 transition cursor-pointer ${
                showCameras 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 shadow-xs' 
                  : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'
              }`}
              title="Toggle interior camera viewpoint pins and field-of-view cones on the floor plan"
            >
              <Camera className="w-3 h-3 text-amber-400" />
              <span>Camera Views ({roomHotspots.length})</span>
            </button>
          )}

          <span className="text-slate-400 hidden sm:inline">Walkway:</span>
          <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
            {layout.minClearancePassageFt} ft (Safe &gt; 3.0ft)
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="relative p-3 flex items-center justify-center bg-slate-950/95 overflow-hidden">
        <svg
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          className="w-full h-auto max-h-[460px] drop-shadow-xl"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="gridPattern" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#1E293B" strokeWidth="0.75" />
            </pattern>
            {/* Circulation hatched pattern */}
            <pattern id="corridorHatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#10B981" strokeWidth="1" strokeOpacity="0.25" />
            </pattern>
            {/* Camera FOV radial gradient */}
            <radialGradient id="cameraFovGrad" cx="0%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#F59E0B" stopOpacity="0.45" />
              <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
            </radialGradient>
            <radialGradient id="cameraFovActiveGrad" cx="0%" cy="0%" r="100%">
              <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.6" />
              <stop offset="70%" stopColor="#38BDF8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#38BDF8" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Grid */}
          <rect width={canvasWidth} height={canvasHeight} fill="url(#gridPattern)" />

          {/* Dimension Lines (Outer) */}
          {/* Top Width Dimension */}
          <g className="text-[10px] font-mono fill-slate-400">
            <line
              x1={offsetX}
              y1={offsetY - 20}
              x2={offsetX + roomSvgWidth}
              y2={offsetY - 20}
              stroke="#64748B"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            <line x1={offsetX} y1={offsetY - 26} x2={offsetX} y2={offsetY - 14} stroke="#64748B" strokeWidth="1.5" />
            <line x1={offsetX + roomSvgWidth} y1={offsetY - 26} x2={offsetX + roomSvgWidth} y2={offsetY - 14} stroke="#64748B" strokeWidth="1.5" />
            <text x={offsetX + roomSvgWidth / 2} y={offsetY - 26} textAnchor="middle" fill="#94A3B8" fontWeight="600">
              {room.lengthFt}'-0" LENGTH
            </text>
          </g>

          {/* Left Height Dimension */}
          <g className="text-[10px] font-mono fill-slate-400">
            <line
              x1={offsetX - 20}
              y1={offsetY}
              x2={offsetX - 20}
              y2={offsetY + roomSvgHeight}
              stroke="#64748B"
              strokeWidth="1"
              strokeDasharray="2,2"
            />
            <line x1={offsetX - 26} y1={offsetY} x2={offsetX - 14} y2={offsetY} stroke="#64748B" strokeWidth="1.5" />
            <line x1={offsetX - 26} y1={offsetY + roomSvgHeight} x2={offsetX - 14} y2={offsetY + roomSvgHeight} stroke="#64748B" strokeWidth="1.5" />
            <text
              x={offsetX - 26}
              y={offsetY + roomSvgHeight / 2}
              textAnchor="middle"
              transform={`rotate(-90 ${offsetX - 26} ${offsetY + roomSvgHeight / 2})`}
              fill="#94A3B8"
              fontWeight="600"
            >
              {room.widthFt}'-0" WIDTH
            </text>
          </g>

          {/* Room Floor Plane */}
          <rect
            x={offsetX}
            y={offsetY}
            width={roomSvgWidth}
            height={roomSvgHeight}
            fill="#0F172A"
            stroke="#475569"
            strokeWidth="2"
          />

          {/* Circulation Clear Corridor (Safe Path) */}
          {showCirculationCorridors && (
            <g opacity="0.6">
              <rect
                x={offsetX + 40}
                y={offsetY + roomSvgHeight * 0.42}
                width={roomSvgWidth - 80}
                height={roomSvgHeight * 0.3}
                fill="url(#corridorHatch)"
                rx="6"
              />
              <path
                d={`M ${offsetX + 70} ${offsetY + roomSvgHeight * 0.55} L ${offsetX + roomSvgWidth - 70} ${offsetY + roomSvgHeight * 0.55}`}
                stroke="#10B981"
                strokeWidth="2"
                strokeDasharray="4,4"
              />
              <polygon
                points={`${offsetX + roomSvgWidth - 65},${offsetY + roomSvgHeight * 0.55} ${offsetX + roomSvgWidth - 75},${offsetY + roomSvgHeight * 0.55 - 4} ${offsetX + roomSvgWidth - 75},${offsetY + roomSvgHeight * 0.55 + 4}`}
                fill="#10B981"
              />
              <text
                x={offsetX + roomSvgWidth / 2}
                y={offsetY + roomSvgHeight * 0.53}
                textAnchor="middle"
                className="text-[9px] font-mono font-bold"
                fill="#34D399"
              >
                UNOBSTRUCTED 3.8ft CIRCULATION WALKWAY
              </text>
            </g>
          )}

          {/* Doors & Swing Arcs */}
          {room.doors.map(door => {
            let doorX = offsetX;
            let doorY = offsetY;
            const doorW = door.widthFt * scale;

            if (door.wall === 'EAST') {
              doorX = offsetX + roomSvgWidth - 8;
              doorY = offsetY + roomSvgHeight * 0.2;
            } else if (door.wall === 'WEST') {
              doorX = offsetX - 2;
              doorY = offsetY + roomSvgHeight * 0.4;
            } else if (door.wall === 'SOUTH') {
              doorX = offsetX + roomSvgWidth * 0.6;
              doorY = offsetY + roomSvgHeight - 8;
            } else if (door.wall === 'NORTH') {
              doorX = offsetX + (roomSvgWidth - doorW) / 2;
              doorY = offsetY - 4;
            }

            return (
              <g key={door.id}>
                {/* Door Opening Gap in Wall */}
                <rect
                  x={doorX}
                  y={doorY}
                  width={door.wall === 'EAST' || door.wall === 'WEST' ? 10 : doorW}
                  height={door.wall === 'EAST' || door.wall === 'WEST' ? doorW : 10}
                  fill="#0284C7"
                  opacity="0.9"
                />
                {/* Swing arc if hinged door */}
                {door.swingDirection.includes('INWARD') && (
                  <path
                    d={`M ${doorX} ${doorY} A ${doorW} ${doorW} 0 0 1 ${doorX - doorW * 0.7} ${doorY + doorW * 0.7}`}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1.2"
                    strokeDasharray="2,2"
                    opacity="0.8"
                  />
                )}
                <text
                  x={doorX + (door.wall === 'EAST' ? 14 : door.wall === 'NORTH' ? doorW / 2 : -14)}
                  y={door.wall === 'NORTH' ? doorY - 6 : doorY + doorW / 2}
                  textAnchor={door.wall === 'NORTH' ? 'middle' : door.wall === 'EAST' ? 'start' : 'end'}
                  className="text-[8px] font-mono font-bold fill-sky-300"
                >
                  {door.id} ({door.widthFt}ft)
                </text>
              </g>
            );
          })}

          {/* Windows with Daylight Rays */}
          {room.windows.map(win => {
            const winW = win.widthFt * scale;
            const winX = offsetX + (win.wall === 'WEST' ? -6 : win.wall === 'EAST' ? roomSvgWidth - 2 : 30);
            const winY = offsetY + (win.wall === 'NORTH' ? -6 : roomSvgHeight * 0.25);

            return (
              <g key={win.id}>
                <rect
                  x={winX}
                  y={winY}
                  width={win.wall === 'WEST' || win.wall === 'EAST' ? 8 : winW}
                  height={win.wall === 'WEST' || win.wall === 'EAST' ? winW : 8}
                  fill="#F59E0B"
                  stroke="#FDE68A"
                  strokeWidth="1"
                />
                <text
                  x={winX - 10}
                  y={winY + winW / 2}
                  textAnchor="end"
                  className="text-[8px] font-mono font-bold fill-amber-300"
                >
                  DAYLIGHT ({win.widthFt}ft)
                </text>
              </g>
            );
          })}

          {/* Structural Perimeter Walls (Thick Architectural Boundary) */}
          <rect
            x={offsetX}
            y={offsetY}
            width={roomSvgWidth}
            height={roomSvgHeight}
            fill="none"
            stroke="#94A3B8"
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Structural Columns */}
          {room.structuralColumns.map(col => {
            const colX = offsetX + (col.xFt * scale);
            const colY = offsetY + (col.yFt * scale);
            const colW = (col.widthInches / 12) * scale;
            const colD = (col.depthInches / 12) * scale;
            return (
              <g key={col.id}>
                <rect
                  x={colX}
                  y={colY}
                  width={colW}
                  height={colD}
                  fill="#334155"
                  stroke="#CBD5E1"
                  strokeWidth="1"
                />
                <line x1={colX} y1={colY} x2={colX + colW} y2={colY + colD} stroke="#64748B" strokeWidth="0.75" />
                <line x1={colX + colW} y1={colY} x2={colX} y2={colY + colD} stroke="#64748B" strokeWidth="0.75" />
              </g>
            );
          })}

          {/* Furniture Placement Pieces */}
          {layout.furnitureItems.map(item => {
            const itemW = item.widthFt * scale;
            const itemD = item.depthFt * scale;
            const itemX = offsetX + (item.positionXPercent / 100) * (roomSvgWidth - itemW);
            const itemY = offsetY + (item.positionYPercent / 100) * (roomSvgHeight - itemD);

            const isSelected = selectedFurnitureId === item.id;
            const isHovered = hoveredFurniture?.id === item.id;
            const style = getCategoryStyles(item.category);

            return (
              <g
                key={item.id}
                className="cursor-pointer transition-all duration-150"
                onClick={() => onSelectFurniture?.(isSelected ? null : item)}
                onMouseEnter={() => setHoveredFurniture(item)}
                onMouseLeave={() => setHoveredFurniture(null)}
              >
                {/* Selection halo */}
                {(isSelected || isHovered) && (
                  <rect
                    x={itemX - 5}
                    y={itemY - 5}
                    width={itemW + 10}
                    height={itemD + 10}
                    fill="none"
                    stroke={isSelected ? '#38BDF8' : '#FBBF24'}
                    strokeWidth="2"
                    strokeDasharray="4,3"
                    rx="8"
                  />
                )}

                {/* Furniture Body */}
                <rect
                  x={itemX}
                  y={itemY}
                  width={itemW}
                  height={itemD}
                  fill={style.fill}
                  stroke={isSelected ? '#FFFFFF' : style.stroke}
                  strokeWidth={isSelected ? 2.5 : 1.5}
                  rx="6"
                  opacity={isSelected ? 1 : 0.9}
                />

                {/* Internal detail cues */}
                <line
                  x1={itemX + 6}
                  y1={itemY + itemD * 0.3}
                  x2={itemX + itemW - 6}
                  y2={itemY + itemD * 0.3}
                  stroke="rgba(255,255,255,0.4)"
                  strokeWidth="1"
                />

                {/* Label */}
                <text
                  x={itemX + itemW / 2}
                  y={itemY + itemD / 2 - 3}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[9px] font-mono font-bold fill-white pointer-events-none drop-shadow-md"
                >
                  {item.widthFt}' × {item.depthFt}'
                </text>

                <text
                  x={itemX + itemW / 2}
                  y={itemY + itemD / 2 + 8}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="text-[7.5px] font-sans font-semibold fill-slate-100 pointer-events-none drop-shadow-md"
                >
                  {item.name.slice(0, 18)}
                </text>
              </g>
            );
          })}

          {/* ========================================================= */}
          {/* INTERACTIVE CAMERA VIEWPOINT HOTSPOTS & FIELD-OF-VIEW CONES */}
          {/* ========================================================= */}
          {showCameras && roomHotspots.map((refImg) => {
            const hs = refImg.cameraHotspot!;
            const hX = offsetX + (hs.positionXPercent / 100) * roomSvgWidth;
            const hY = offsetY + (hs.positionYPercent / 100) * roomSvgHeight;
            const isActive = activeReferenceImageId === refImg.id || activeReferenceImageId === refImg.imageUrl;
            const isHovered = hoveredHotspot?.id === refImg.id;

            // Compute Field of View Cone Geometry
            const coneDist = isActive || isHovered ? 80 : 55;
            const angleRad = (hs.angleDegrees * Math.PI) / 180;
            const halfFovRad = (((hs.fieldOfViewDegrees || 60) / 2) * Math.PI) / 180;

            const p1X = hX + Math.cos(angleRad - halfFovRad) * coneDist;
            const p1Y = hY + Math.sin(angleRad - halfFovRad) * coneDist;
            const p2X = hX + Math.cos(angleRad + halfFovRad) * coneDist;
            const p2Y = hY + Math.sin(angleRad + halfFovRad) * coneDist;

            return (
              <g
                key={refImg.id}
                className="cursor-pointer group"
                onClick={() => onSelectReferenceImage?.(refImg)}
                onMouseEnter={() => setHoveredHotspot(refImg)}
                onMouseLeave={() => setHoveredHotspot(null)}
              >
                {/* Field-of-View Cone Path */}
                <path
                  d={`M ${hX} ${hY} L ${p1X} ${p1Y} A ${coneDist} ${coneDist} 0 0 1 ${p2X} ${p2Y} Z`}
                  fill={isActive ? 'url(#cameraFovActiveGrad)' : 'url(#cameraFovGrad)'}
                  stroke={isActive ? '#38BDF8' : '#F59E0B'}
                  strokeWidth={isActive || isHovered ? 1.5 : 0.75}
                  strokeDasharray={isActive ? 'none' : '3,3'}
                  opacity={isActive || isHovered ? 0.95 : 0.45}
                  className="transition-all duration-200"
                />

                {/* Central Viewing Direction Ray */}
                <line
                  x1={hX}
                  y1={hY}
                  x2={hX + Math.cos(angleRad) * coneDist}
                  y2={hY + Math.sin(angleRad) * coneDist}
                  stroke={isActive ? '#38BDF8' : '#FBBF24'}
                  strokeWidth={isActive || isHovered ? 1.5 : 0.75}
                  strokeDasharray="2,2"
                  opacity={isActive || isHovered ? 0.9 : 0.4}
                />

                {/* Camera Pin Halo Ring */}
                <circle
                  cx={hX}
                  cy={hY}
                  r={isActive ? 16 : isHovered ? 14 : 11}
                  fill={isActive ? '#0284C7' : isHovered ? '#D97706' : '#1E293B'}
                  stroke={isActive ? '#38BDF8' : isHovered ? '#FDE68A' : '#F59E0B'}
                  strokeWidth={isActive ? 2.5 : 1.5}
                  className="transition-all duration-200 drop-shadow-md"
                />

                {/* Pulse Ring for Active Pin */}
                {isActive && (
                  <circle
                    cx={hX}
                    cy={hY}
                    r={22}
                    fill="none"
                    stroke="#38BDF8"
                    strokeWidth="1.5"
                    opacity="0.6"
                    className="animate-ping"
                  />
                )}

                {/* Camera Center Dot / Icon Representation */}
                <circle
                  cx={hX}
                  cy={hY}
                  r={isActive ? 4 : 3}
                  fill={isActive ? '#FFFFFF' : '#F59E0B'}
                />

                {/* Camera Code Label Badge */}
                <rect
                  x={hX - 18}
                  y={hY + 14}
                  width={36}
                  height={13}
                  rx={3}
                  fill="#0B132B"
                  stroke={isActive ? '#38BDF8' : '#F59E0B'}
                  strokeWidth={1}
                  opacity={0.9}
                />
                <text
                  x={hX}
                  y={hY + 23}
                  textAnchor="middle"
                  className="text-[7.5px] font-mono font-bold"
                  fill={isActive ? '#38BDF8' : '#FDE68A'}
                >
                  {hs.cameraLabel.split(' ')[0]}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Floating Tooltip / Micro-Preview when hovering over a camera hotspot */}
        {hoveredHotspot && hoveredHotspot.cameraHotspot && (
          <div 
            className="absolute top-4 right-4 z-20 w-64 bg-slate-900/95 border border-amber-400/50 rounded-xl p-2.5 shadow-2xl backdrop-blur-md text-white pointer-events-none animate-in fade-in duration-150"
          >
            <div className="flex items-center gap-1.5 text-amber-300 text-[10px] font-mono font-bold mb-1">
              <Camera className="w-3 h-3 text-amber-400" />
              <span>{hoveredHotspot.cameraHotspot.cameraLabel}</span>
            </div>
            <div className="relative rounded-lg overflow-hidden border border-slate-700 aspect-video mb-1.5 bg-black">
              <img
                src={hoveredHotspot.imageUrl}
                alt={hoveredHotspot.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-1 left-1.5 right-1.5 text-[10px] font-semibold text-white truncate">
                {hoveredHotspot.title}
              </div>
            </div>
            <p className="text-[10px] text-slate-300 leading-tight line-clamp-2">
              <strong>Facing:</strong> {hoveredHotspot.cameraHotspot.viewTargetName}
            </p>
            <div className="mt-1.5 pt-1.5 border-t border-slate-800 flex items-center justify-between text-[9px] text-amber-400 font-bold">
              <span>Click to apply to interior view</span>
              <ArrowUpRight className="w-3 h-3" />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Inspection Strip: Shows Selected/Hovered Furniture or Camera Hotspot Details */}
      <div className="bg-slate-900 border-t border-slate-800 p-2.5 text-xs flex flex-wrap items-center justify-between gap-3">
        {hoveredHotspot ? (
          <div className="flex flex-wrap items-center gap-2.5 w-full">
            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60 flex items-center gap-1">
              <Camera className="w-3 h-3 text-amber-400" />
              <span>{hoveredHotspot.cameraHotspot?.cameraLabel}</span>
            </span>
            <span className="font-bold text-white truncate">
              {hoveredHotspot.title}
            </span>
            <span className="text-slate-400 font-mono text-[11px]">
              Target: {hoveredHotspot.cameraHotspot?.viewTargetName}
            </span>
            <button
              type="button"
              onClick={() => onSelectReferenceImage?.(hoveredHotspot)}
              className="ml-auto px-2.5 py-1 rounded bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-[10px] transition cursor-pointer flex items-center gap-1 shadow-xs"
            >
              <span>Apply to Interior View</span>
              <ArrowUpRight className="w-3 h-3" />
            </button>
          </div>
        ) : (hoveredFurniture || (selectedFurnitureId && layout.furnitureItems.find(f => f.id === selectedFurnitureId))) ? (
          (() => {
            const activeItem = hoveredFurniture || layout.furnitureItems.find(f => f.id === selectedFurnitureId)!;
            const style = getCategoryStyles(activeItem.category);
            return (
              <div className="flex flex-wrap items-center gap-2.5 w-full">
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-slate-800 border ${style.text}`}>
                  {activeItem.category}
                </span>
                <span className="font-bold text-white">
                  {activeItem.name}
                </span>
                <span className="text-slate-400 font-mono">
                  ({activeItem.widthFt}' × {activeItem.depthFt}' × {activeItem.heightFt}'h)
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 flex items-center gap-1 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{activeItem.whyItFits}</span>
                </span>
                <span className="ml-auto font-mono font-bold text-amber-300">
                  ₹{activeItem.estimatedCost.toLocaleString()}
                </span>
              </div>
            );
          })()
        ) : (
          <div className="text-slate-400 flex flex-wrap items-center justify-between gap-2 w-full text-[11px]">
            <div className="flex items-center gap-2">
              <Camera className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {roomHotspots.length > 0 
                  ? `Click any camera pin (Cam 1–${roomHotspots.length}) to switch the interior render view to that viewpoint.` 
                  : 'Hover or click furniture pieces to inspect clearances and dimensions.'}
              </span>
            </div>
            {/* Quick Palette Legend */}
            <div className="flex items-center gap-2.5 text-[10px] font-mono text-slate-500">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-sky-500" /> Seating
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" /> Dining
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-pink-500" /> Bed
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-400" /> Camera Angle
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
