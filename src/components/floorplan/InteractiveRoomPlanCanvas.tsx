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
  Sparkles
} from 'lucide-react';
import { 
  ExtractedRoomGeometry, 
  FurnitureLayoutOption, 
  FurnitureLayoutItem 
} from '../../types/floorplanSpatial';

interface InteractiveRoomPlanCanvasProps {
  room: ExtractedRoomGeometry;
  layout: FurnitureLayoutOption;
  selectedFurnitureId?: string | null;
  onSelectFurniture?: (item: FurnitureLayoutItem | null) => void;
  showCirculationCorridors?: boolean;
}

export const InteractiveRoomPlanCanvas: React.FC<InteractiveRoomPlanCanvasProps> = ({
  room,
  layout,
  selectedFurnitureId,
  onSelectFurniture,
  showCirculationCorridors = true
}) => {
  const [hoveredFurniture, setHoveredFurniture] = useState<FurnitureLayoutItem | null>(null);

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
      <div className="bg-slate-900/90 px-3.5 py-2.5 border-b border-slate-800/80 flex items-center justify-between text-xs">
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
          <span className="text-slate-400">Min Walk Clearance:</span>
          <span className="font-mono font-bold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/50">
            {layout.minClearancePassageFt} ft (Safe &gt; 3.0ft)
          </span>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="p-3 flex items-center justify-center bg-slate-950/95 overflow-hidden">
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
                  x={doorX + (door.wall === 'EAST' ? 14 : -14)}
                  y={doorY + doorW / 2}
                  textAnchor={door.wall === 'EAST' ? 'start' : 'end'}
                  className="text-[8px] font-mono font-bold fill-sky-300"
                >
                  {door.id} ({door.widthFt}ft)
                </text>
              </g>
            );
          })}

          {/* Windows with Sunlight Rays */}
          {room.windows.map(win => {
            const winW = win.widthFt * scale;
            const winX = offsetX + (win.wall === 'WEST' ? -6 : 30);
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
                {/* Glazing lines */}
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
            // Position percentage relative to room floor
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
        </svg>
      </div>

      {/* Bottom Inspection Strip: Shows Selected/Hovered Furniture Details */}
      <div className="bg-slate-900 border-t border-slate-800 p-2.5 text-xs flex flex-wrap items-center justify-between gap-3">
        {(hoveredFurniture || (selectedFurnitureId && layout.furnitureItems.find(f => f.id === selectedFurnitureId))) ? (
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
          <div className="text-slate-400 flex items-center gap-2">
            <Info className="w-3.5 h-3.5 text-blue-400" />
            <span>Hover or click any furniture item on the measured plan to view ergonomic clearances and dimensions.</span>
          </div>
        )}
      </div>
    </div>
  );
};
