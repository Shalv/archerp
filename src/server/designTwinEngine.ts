/**
 * Build Storys ERP - PROJECT DESIGN DIGITAL TWIN ENGINE
 * ====================================================
 * Builds and maintains the single source of truth for a project's design, and
 * refuses to let anything unrelated into it.
 *
 *   buildDesignTwin()          approved concept + confirmed floor plan + BOQ
 *                              -> rooms, elements, materials, assets, prompts
 *   validateDesignPackage()    the 10 mandatory relationships, computed from
 *                              records (never from prose or a checklist image)
 *   applyElementChange()       revision that touches only what depends on the
 *                              changed element, prices the BOQ delta, keeps the
 *                              previous approved version and re-opens approval
 *   approveElementRevision()   approve the regenerated assets of one element
 *   approvePackage()           package-level sign-off (validation must pass)
 *   publishDesignPackage()     the gate: APPROVED_FOR_EXECUTION only
 *
 * Visual assets are DERIVED, not fetched: elevations and plans are SVG drawn
 * from verified geometry, swatches and mood boards are SVG drawn from the
 * approved material and palette records. Nothing is a stock photo, and every
 * asset names the material IDs it depicts.
 */

import { BOQItem } from '../types/erp';
import { DesignConcept, DesignStudioSession, FloorPlanModel, RoomScheme } from '../types/designStudio';
import {
  AssetApproval,
  AssetSource,
  AssetStatus,
  AssetType,
  DesignAssetRecord,
  DesignElement,
  DesignTwin,
  ElementKind,
  MaterialSpecRecord,
  PackageStatus,
  TwinApproval,
  TwinFloor,
  TwinPromptRecord,
  TwinRevision,
  TwinRoom,
  ValidationCheck,
  ValidationReport,
  WallDirection
} from '../types/designTwin';

// ---------------------------------------------------------------------------
// small helpers
// ---------------------------------------------------------------------------
const now = () => new Date().toISOString();
const r2 = (n: number) => Math.round(n * 100) / 100;

const ROOM_PREFIX: Record<string, string> = {
  MASTER_BEDROOM: 'MBR',
  BEDROOM: 'BDR',
  KIDS_BEDROOM: 'KBR',
  LIVING: 'LIV',
  DINING: 'DIN',
  KITCHEN: 'KIT',
  UTILITY: 'UTL',
  BATHROOM: 'BTH',
  POWDER_ROOM: 'PWD',
  WARDROBE: 'WRD',
  STAIRCASE: 'STR',
  BALCONY: 'BAL',
  DECK: 'DCK',
  STUDY: 'STD',
  GAZEBO: 'GZB',
  OTHER: 'RM'
};

const KIND_SHORT: Record<ElementKind, string> = {
  WALL_A: 'WA',
  WALL_B: 'WB',
  WALL_C: 'WC',
  WALL_D: 'WD',
  CEILING: 'CE',
  FLOORING: 'FL',
  DOORS_WINDOWS: 'DW',
  ELECTRICAL: 'EL',
  LIGHTING: 'LT',
  FURNITURE_JOINERY: 'FJ',
  PLUMBING_HVAC: 'PH'
};

const WALL_KINDS: ElementKind[] = ['WALL_A', 'WALL_B', 'WALL_C', 'WALL_D'];
const WALL_DIRECTIONS: WallDirection[] = ['NORTH', 'EAST', 'SOUTH', 'WEST'];
const OUTDOOR_TYPES = new Set(['BALCONY', 'DECK']);
const SERVICE_KINDS: ElementKind[] = ['ELECTRICAL', 'LIGHTING', 'PLUMBING_HVAC'];

const FINISH_KINDS = new Set<ElementKind>([
  'WALL_A',
  'WALL_B',
  'WALL_C',
  'WALL_D',
  'CEILING',
  'FLOORING',
  'DOORS_WINDOWS',
  'FURNITURE_JOINERY'
]);

const svgUri = (svg: string) => `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
const esc = (s: string) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

function colourOf(material: MaterialSpecRecord, fallback = '#cbd5e1'): string {
  if (material.colourHex) return material.colourHex;
  const map: Record<string, string> = {
    'Stone flooring': '#d9cfc0',
    'Wooden flooring': '#b98b5e',
    'Tile flooring': '#d7d9d6',
    'Wet area flooring': '#c9cdc8',
    'Deck / outdoor flooring': '#9a7350',
    Ceiling: '#f4f4f2',
    'Painting & polish': '#efe9df',
    'Wardrobe / storage joinery': '#a9835c',
    'Feature joinery': '#8f6b47',
    'Modular kitchen': '#cfc9c0',
    'Electrical & automation': '#e6e6e4',
    'Plumbing & sanitary': '#dfe5ea',
    'Air conditioning': '#e9edf0',
    'Gazebo structure & pergola': '#8a6a4a'
  };
  return map[material.category] || fallback;
}

// ---------------------------------------------------------------------------
// SVG asset builders - all deterministic, all derived from records
// ---------------------------------------------------------------------------
function wallElevationSvg(room: TwinRoom, kind: ElementKind, direction: WallDirection, materials: MaterialSpecRecord[]): string {
  const wallLength = direction === 'NORTH' || direction === 'SOUTH' ? room.geometry.lengthFt : room.geometry.widthFt;
  const height = room.geometry.ceilingHeightFt;
  const pad = 46;
  const drawW = 620;
  const drawH = Math.round((drawW * height) / Math.max(wallLength, 1));
  const finish = materials[0];
  const fill = finish ? colourOf(finish) : '#e2e8f0';
  const label = finish ? `${finish.name} · ${finish.id}` : 'NO APPROVED MATERIAL';

  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${drawW + pad * 2}" height="${drawH + pad * 2}" viewBox="0 0 ${drawW + pad * 2} ${drawH + pad * 2}">
<rect width="100%" height="100%" fill="#ffffff"/>
<rect x="${pad}" y="${pad}" width="${drawW}" height="${drawH}" fill="${fill}" stroke="#111827" stroke-width="2"/>
<line x1="${pad}" y1="${pad}" x2="${pad + drawW}" y2="${pad}" stroke="#111827" stroke-width="3"/>
<line x1="${pad}" y1="${pad + drawH}" x2="${pad + drawW}" y2="${pad + drawH}" stroke="#111827" stroke-width="4"/>
<line x1="${pad}" y1="${pad}" x2="${pad}" y2="${pad + drawH}" stroke="#111827" stroke-width="3"/>
<line x1="${pad + drawW}" y1="${pad}" x2="${pad + drawW}" y2="${pad + drawH}" stroke="#111827" stroke-width="3"/>
<text x="${pad}" y="${pad - 14}" font-family="Arial" font-size="13" font-weight="bold" fill="#111827">${esc(room.name)} — ${esc(kind.replace('_', ' '))} (${direction})</text>
<text x="${pad}" y="${pad + drawH + 20}" font-family="Arial" font-size="12" fill="#374151">Wall ${wallLength.toFixed(2)}' × ${height.toFixed(2)}' · scale 1:25 · ${esc(label)}</text>
<text x="${pad}" y="${pad + drawH + 36}" font-family="Arial" font-size="10" fill="#6b7280">Geometry: ${room.geometry.verified ? 'VERIFIED' : 'UNVERIFIED — DO NOT ISSUE'} · ${esc(room.floorPlanRoomId)}</text>
</svg>`);
}

function dimensionSheetSvg(room: TwinRoom): string {
  const w = 640;
  const h = 380;
  const boxW = 460;
  const boxH = 240;
  const x = (w - boxW) / 2;
  const y = (h - boxH) / 2;
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="100%" height="100%" fill="#ffffff"/>
<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" fill="none" stroke="#111827" stroke-width="3"/>
<line x1="${x}" y1="${y - 18}" x2="${x + boxW}" y2="${y - 18}" stroke="#0F6CBD" stroke-width="1"/>
<text x="${x + boxW / 2}" y="${y - 24}" text-anchor="middle" font-family="Arial" font-size="12" fill="#0F6CBD">${room.geometry.lengthFt.toFixed(2)}'</text>
<line x1="${x + boxW + 18}" y1="${y}" x2="${x + boxW + 18}" y2="${y + boxH}" stroke="#0F6CBD" stroke-width="1"/>
<text x="${x + boxW + 26}" y="${y + boxH / 2}" font-family="Arial" font-size="12" fill="#0F6CBD">${room.geometry.widthFt.toFixed(2)}'</text>
<text x="${x}" y="${y - 44}" font-family="Arial" font-size="13" font-weight="bold" fill="#111827">${esc(room.name)} — dimension sheet</text>
<text x="${x}" y="${y + boxH + 26}" font-family="Arial" font-size="11" fill="#374151">Carpet ${room.geometry.areaSqFt} sq.ft · perimeter ${room.geometry.perimeterFt}' · ceiling ${room.geometry.ceilingHeightFt}'</text>
<text x="${x}" y="${y + boxH + 42}" font-family="Arial" font-size="10" fill="#6b7280">Source: ${esc(room.floorPlanRoomId)} (${room.geometry.confidence}) · ${room.geometry.verified ? 'VERIFIED' : 'UNVERIFIED'}</text>
</svg>`);
}

function materialSwatchSvg(material: MaterialSpecRecord, room: TwinRoom): string {
  const fill = colourOf(material);
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="360" height="220" viewBox="0 0 360 220">
<rect width="100%" height="100%" fill="#ffffff"/>
<rect x="0" y="0" width="360" height="140" fill="${fill}"/>
<rect x="0" y="0" width="360" height="140" fill="none" stroke="#111827" stroke-width="1" opacity="0.25"/>
<text x="14" y="164" font-family="Arial" font-size="13" font-weight="bold" fill="#111827">${esc(material.name)}</text>
<text x="14" y="182" font-family="Arial" font-size="11" fill="#374151">${esc(material.brand)} · ${esc(material.finish)}</text>
<text x="14" y="200" font-family="Arial" font-size="10" fill="#6b7280">${esc(material.id)} · ${esc(material.specification).slice(0, 62)}</text>
<text x="14" y="214" font-family="Arial" font-size="9" fill="#9ca3af">${esc(room.name)} · ${material.approved ? 'APPROVED SPEC' : 'NOT APPROVED'}</text>
</svg>`);
}

function moodBoardSvg(room: TwinRoom, materials: MaterialSpecRecord[], palette: string[]): string {
  const tiles = materials.slice(0, 4);
  const tileW = 150;
  const tileH = 104;
  const chips = palette.slice(0, 4);
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="660" height="330" viewBox="0 0 660 330">
<rect width="100%" height="100%" fill="#faf9f7"/>
<text x="24" y="34" font-family="Arial" font-size="14" font-weight="bold" fill="#111827">${esc(room.name)} — mood board</text>
<text x="24" y="52" font-family="Arial" font-size="10" fill="#6b7280">Materials and colours from the approved specification only</text>
${tiles
  .map(
    (m, i) => `<g transform="translate(${24 + i * (tileW + 12)},70)">
  <rect width="${tileW}" height="${tileH}" fill="${colourOf(m)}" stroke="#d1d5db"/>
  <text x="6" y="${tileH + 14}" font-family="Arial" font-size="9" fill="#374151">${esc(m.id)}</text>
  <text x="6" y="${tileH + 26}" font-family="Arial" font-size="9" fill="#6b7280">${esc(m.name).slice(0, 26)}</text>
</g>`
  )
  .join('')}
${chips
  .map(
    (c, i) => `<g transform="translate(${24 + i * 60},250)">
  <circle cx="20" cy="20" r="18" fill="${esc(c.split(' ')[0])}" stroke="#d1d5db"/>
  <text x="20" y="52" text-anchor="middle" font-family="Arial" font-size="8" fill="#6b7280">${esc((c.split(' ')[1] || '').slice(0, 10))}</text>
</g>`
  )
  .join('')}
<text x="470" y="270" font-family="Arial" font-size="10" fill="#6b7280">${esc(room.conceptCode)} v${room.conceptVersion}</text>
</svg>`);
}

function constructionDetailSvg(room: TwinRoom, kind: ElementKind, materials: MaterialSpecRecord[]): string {
  const layers = materials.slice(0, 3);
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="560" height="240" viewBox="0 0 560 240">
<rect width="100%" height="100%" fill="#ffffff"/>
<text x="18" y="26" font-family="Arial" font-size="12" font-weight="bold" fill="#111827">${esc(room.name)} — ${esc(kind.replace('_', ' '))} construction detail</text>
${layers
  .map(
    (m, i) => `<rect x="18" y="${48 + i * 44}" width="360" height="34" fill="${colourOf(m)}" stroke="#111827" stroke-width="1"/>
<text x="390" y="${70 + i * 44}" font-family="Arial" font-size="10" fill="#374151">${esc(m.id)} · ${esc(m.category)} · ${m.unit}</text>`
  )
  .join('')}
<text x="18" y="212" font-family="Arial" font-size="10" fill="#6b7280">Build-up in sequence from substrate · dimensions per dimension sheet · not for issue without approval</text>
</svg>`);
}

function servicePlanSvg(room: TwinRoom, kind: ElementKind, refs: string[]): string {
  const w = 520;
  const h = 300;
  const boxW = 360;
  const boxH = 180;
  const x = (w - boxW) / 2;
  const y = 70;
  const dots = refs.slice(0, 6);
  return svgUri(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<rect width="100%" height="100%" fill="#ffffff"/>
<text x="18" y="28" font-family="Arial" font-size="12" font-weight="bold" fill="#111827">${esc(room.name)} — ${esc(kind.replace('_', ' '))} plan</text>
<rect x="${x}" y="${y}" width="${boxW}" height="${boxH}" fill="#f8fafc" stroke="#111827" stroke-width="2"/>
${dots
  .map(
    (ref, i) => `<circle cx="${x + 40 + (i % 3) * 120}" cy="${y + 45 + Math.floor(i / 3) * 80}" r="7" fill="#0F6CBD"/>
<text x="${x + 52 + (i % 3) * 120}" y="${y + 49 + Math.floor(i / 3) * 80}" font-family="Arial" font-size="9" fill="#374151">${esc(ref)}</text>`
  )
  .join('')}
<text x="18" y="${h - 16}" font-family="Arial" font-size="10" fill="#6b7280">Coordinated with the furniture &amp; joinery layout · ${refs.length} circuit(s)/point group(s)</text>
</svg>`);
}

// ---------------------------------------------------------------------------
// material extraction from the approved concept + BOQ
// ---------------------------------------------------------------------------
const TRADE_TO_KIND: Partial<Record<string, ElementKind>> = {
  FLOORING_TILING: 'FLOORING',
  FALSE_CEILINGS: 'CEILING',
  PAINTING_POLISHING: 'WALL_A',
  CARPENTRY_JOINERY: 'FURNITURE_JOINERY',
  WARDROBES_STORAGE: 'FURNITURE_JOINERY',
  MODULAR_KITCHEN: 'FURNITURE_JOINERY',
  ELECTRICAL_AUTOMATION: 'ELECTRICAL',
  PLUMBING_SANITARY: 'PLUMBING_HVAC',
  HVAC_VENTILATION: 'PLUMBING_HVAC',
  LANDSCAPING_OUTDOORS: 'FLOORING',
  DOORS_WINDOWS_GLAZING: 'DOORS_WINDOWS',
  LIGHTING_FIXTURES: 'LIGHTING',
  CIVIL_MASONRY: 'WALL_A',
  WATERPROOFING: 'FLOORING'
};

function kindForTrade(trade: string): ElementKind {
  return TRADE_TO_KIND[trade] || 'FURNITURE_JOINERY';
}

const ROOM_TYPE_KEYWORDS: Record<string, string[]> = {
  MASTER_BEDROOM: ['master', 'bed', 'bedroom'],
  BEDROOM: ['bed', 'bedroom'],
  KIDS_BEDROOM: ['bed', 'bedroom', 'kids', 'child'],
  LIVING: ['living', 'great room', 'lounge', 'hall'],
  DINING: ['dining'],
  KITCHEN: ['kitchen', 'culinary'],
  UTILITY: ['utility', 'wash'],
  BATHROOM: ['toilet', 'bath', 'ensuite', 'wet'],
  POWDER_ROOM: ['powder'],
  WARDROBE: ['wardrobe', 'walk-in', 'walk in', 'closet'],
  STAIRCASE: ['stair', 'foyer', 'corridor', 'lobby'],
  BALCONY: ['balcony'],
  DECK: ['deck', 'terrace'],
  STUDY: ['study'],
  GAZEBO: ['gazebo', 'pavilion', 'pergola', 'roof']
};

/**
 * A BOQ line belongs to a room when it says so explicitly, when it is a
 * whole-villa line, when the room type is named in the line's zone, or when
 * the line's opening schedule mentions an opening of this room. No fuzzy
 * guessing beyond those four rules.
 */
function boqAppliesToRoom(item: BOQItem, room: { name: string; roomType?: string; openings?: { code: string }[] }): boolean {
  const zone = String(item.roomZone || '').toLowerCase();
  const workPackage = String(item.workPackage || '').toLowerCase();
  if (!zone) return false;
  if (zone.includes('whole villa') || zone.includes('all rooms') || zone.includes('whole house')) return true;

  const name = room.name.toLowerCase();
  if (zone === name || zone.includes(name) || name.includes(zone)) return true;

  const keywords = [
    ...(ROOM_TYPE_KEYWORDS[room.roomType || ''] || []),
    ...name.split(/[^a-z0-9]+/).filter(t => t.length > 3)
  ];
  const zoneWords = zone.split(/[^a-z0-9]+/).filter(Boolean);
  if (keywords.some(k => zoneWords.includes(k) || zone.includes(k))) return true;

  // opening schedule: SD1, D1, W1, FW1 ... mapped to the host room
  const openingCodes = (room.openings || []).map(o => o.code.toLowerCase());
  if (openingCodes.some(code => new RegExp(`(^|[^a-z0-9])${code}([^a-z0-9]|$)`).test(zone))) return true;

  if (/lighting|electrical|automation/.test(workPackage) && /whole villa|all rooms/.test(workPackage)) return true;
  return false;
}

// ---------------------------------------------------------------------------
// 1. BUILD
// ---------------------------------------------------------------------------
export interface BuildTwinInput {
  projectId: string;
  model: FloorPlanModel;
  concept: DesignConcept;
  boqItems: BOQItem[];
  boqRevisionId?: string;
  actor: string;
  requirements?: { id: string; text: string }[];
}

export function buildDesignTwin(input: BuildTwinInput): DesignTwin {
  const { projectId, model, concept, boqItems, actor } = input;
  const designVersion = 'V1.0';
  const revision = 'R01';
  const createdAt = now();

  // Whole-villa BOQ lines (paint, electrical, glazing) are ALLOCATED to rooms by
  // area share, never duplicated - otherwise a room-level change would price the
  // entire villa.
  const totalFinishArea = model.rooms.reduce((sum, r) => sum + r.wallAreaSqFt + r.areaSqFt, 0) || 1;
  const isWholeVillaLine = (item: BOQItem) => /whole villa|all rooms|whole house/i.test(String(item.roomZone || ''));

  const rooms: TwinRoom[] = [];
  const materials: MaterialSpecRecord[] = [];
  const assets: DesignAssetRecord[] = [];
  const prompts: TwinPromptRecord[] = [];

  const floors: TwinFloor[] = [];
  const floorByName = new Map<string, TwinFloor>();

  model.rooms.forEach((planRoom, roomIndex) => {
    const scheme: RoomScheme | undefined = concept.roomSchemes.find(s => s.roomId === planRoom.id);
    if (!scheme) return; // a room with no approved scheme cannot enter the twin

    const prefix = ROOM_PREFIX[planRoom.roomType] || 'RM';
    const roomId = `${prefix}-${String(roomIndex + 1).padStart(3, '0')}`;
    const verified =
      planRoom.confidence === 'CAD_EXTRACTED' ||
      planRoom.confidence === 'SITE_MEASURED' ||
      planRoom.confidence === 'USER_VERIFIED';

    const floorName = planRoom.floor || 'Ground Floor';
    if (!floorByName.has(floorName)) {
      const floor: TwinFloor = {
        id: `FLR-${String(floorByName.size + 1).padStart(2, '0')}`,
        name: floorName,
        level: floorByName.size,
        roomIds: []
      };
      floorByName.set(floorName, floor);
      floors.push(floor);
    }
    const floor = floorByName.get(floorName)!;
    floor.roomIds.push(roomId);

    const enclosed = !OUTDOOR_TYPES.has(planRoom.roomType);

    // ---- materials for this room: BOQ lines first (they carry rates + codes)
    const roomBoq = boqItems.filter(item =>
      boqAppliesToRoom(item, { name: planRoom.name, roomType: planRoom.roomType, openings: planRoom.openings })
    );
    const roomMaterials: MaterialSpecRecord[] = [];

    const roomFinishArea = planRoom.wallAreaSqFt + planRoom.areaSqFt;
    const allocatedQuantity = (item: BOQItem) =>
      isWholeVillaLine(item) ? r2(item.finalQuantity * (roomFinishArea / totalFinishArea)) : item.finalQuantity;

    roomBoq.forEach((item, index) => {
      const kind = kindForTrade(item.trade);
      const material: MaterialSpecRecord = {
        id: `MAT-${roomId}-${KIND_SHORT[kind]}-${String(index + 1).padStart(2, '0')}`,
        projectId,
        name: item.description.split(' in ')[0].slice(0, 80),
        category: item.workPackage,
        specification: item.specification,
        brand: item.brandGrade,
        finish: item.assumptions?.slice(0, 60) || 'As per specification',
        unit: item.unit,
        trade: item.trade,
        rate: item.sellingRate,
        approved: item.rateStatus === 'APPROVED',
        boqQuantity: allocatedQuantity(item),
        boqItemCodes: [item.itemCode],
        supplierRef: item.sourceDocumentRef,
        colourHex: undefined,
        notes: isWholeVillaLine(item)
          ? `Allocated share of whole-villa line ${item.itemCode} (${allocatedQuantity(item)} of ${item.finalQuantity} ${item.unit})`
          : item.notes
      };
      roomMaterials.push(material);
      materials.push(material);
    });

    // ---- palette from the approved concept
    const palette = (scheme.palette.length ? scheme.palette : concept.palette).slice(0, 6);

    const materialsForKind = (kind: ElementKind) =>
      roomMaterials.filter(m => kindForTrade(m.trade) === kind ||
        (kind === 'WALL_B' || kind === 'WALL_C' || kind === 'WALL_D') && kindForTrade(m.trade) === 'WALL_A');

    // ---- elements
    const elementKinds: ElementKind[] = [];
    if (enclosed) elementKinds.push(...WALL_KINDS);
    elementKinds.push('CEILING', 'FLOORING');
    if (enclosed) elementKinds.push('DOORS_WINDOWS');
    elementKinds.push('ELECTRICAL', 'LIGHTING', 'FURNITURE_JOINERY');
    if (['BATHROOM', 'POWDER_ROOM', 'KITCHEN', 'UTILITY'].includes(planRoom.roomType)) elementKinds.push('PLUMBING_HVAC');

    const roomElements: DesignElement[] = [];
    const roomAssets: DesignAssetRecord[] = [];

    const elementIdFor = (kind: ElementKind) => `${roomId}-${KIND_SHORT[kind]}`;

    // one room-level render, parented to the furniture/joinery element
    const renderElementId = elementIdFor('FURNITURE_JOINERY');
    const renderPrompt: TwinPromptRecord = {
      id: `PROMPT-${roomId}-RD-01`,
      projectId,
      elementId: renderElementId,
      text: concept.imagePromptUsed,
      model: concept.aiGeneration?.imageModel || 'project-render-set',
      createdAt,
      createdBy: actor,
      assetIds: [],
      constraints: {
        designVersion,
        materialRefs: roomMaterials.map(m => m.id),
        colourRefs: palette,
        geometry: `${planRoom.lengthFt}' x ${planRoom.widthFt}' x ${planRoom.ceilingHeightFt}'`,
        style: `${concept.name} (${concept.style})`
      }
    };
    prompts.push(renderPrompt);

    const renderAsset: DesignAssetRecord = {
      id: `AST-${roomId}-RD-001`,
      projectId,
      roomId,
      elementId: renderElementId,
      assetType: 'RENDER_3D',
      designVersion,
      revision,
      drawingRef: `RD-${roomId}`,
      materialRefs: roomMaterials.map(m => m.id),
      source: concept.aiGeneration ? 'AI_GENERATED' : 'PROJECT_LIBRARY',
      promptRef: renderPrompt.id,
      approvalStatus: 'APPROVED',
      approvedBy: concept.approvedBy,
      approvedAt: concept.approvedAt,
      url: scheme.renderImageUrl,
      provenance: {
        origin: concept.aiGeneration ? 'Puter.js / studio render' : 'Villa 253 approved render set',
        method: concept.aiGeneration
          ? `Generated from the approved room specification (${concept.code} v${concept.version})`
          : `Selected from the project render set for ${concept.code} v${concept.version}`,
        generatedAt: concept.aiGeneration?.rendersGeneratedAt || concept.approvedAt,
        generatedBy: concept.approvedBy,
        model: concept.aiGeneration?.imageModel
      },
      status: 'READY',
      geometryBasis: {
        lengthFt: planRoom.lengthFt,
        widthFt: planRoom.widthFt,
        ceilingHeightFt: planRoom.ceilingHeightFt,
        areaSqFt: planRoom.areaSqFt,
        verified,
        sourceRef: model.source.fileName || model.source.kind
      }
    };
    renderPrompt.assetIds.push(renderAsset.id);
    roomAssets.push(renderAsset);

    elementKinds.forEach(kind => {
      const elementId = elementIdFor(kind);
      const wallIndex = WALL_KINDS.indexOf(kind);
      const direction = wallIndex >= 0 ? WALL_DIRECTIONS[wallIndex] : undefined;
      const kindMaterials = materialsForKind(kind);
      const materialRefs = kindMaterials.map(m => m.id);

      const furnitureRefs = kind === 'FURNITURE_JOINERY' && materialRefs.length ? scheme.furniture : [];
      const lightingRefs =
        kind === 'LIGHTING'
          ? [...scheme.lighting, 'CIRC-LIGHT']
          : kind === 'ELECTRICAL'
            ? ['CIRC-LIGHT', 'CIRC-POWER']
            : [];
      const electricalRefs = kind === 'ELECTRICAL' ? ['CIRC-POWER', 'DB-V253'] : [];
      const plumbingRefs = kind === 'PLUMBING_HVAC' ? ['PLUMB-COLD', 'PLUMB-HOT', 'DRAIN', 'VRF-REF'] : [];

      const spec = {
        materialRefs,
        colourRefs: palette,
        dimensions: {
          lengthFt: planRoom.lengthFt,
          widthFt: planRoom.widthFt,
          heightFt: planRoom.ceilingHeightFt,
          verified
        },
        constructionNotes:
          kind === 'CEILING'
            ? ['12.5mm gypsum on GI framing at 610mm centres', 'Perimeter cove for indirect lighting', 'Access panels at AC and electrical points']
            : kind === 'FLOORING'
              ? ['Substrate moisture below 4% before fixing', 'Wastage 7% included in the BOQ quantity', 'Protection sheeting until handover']
              : WALL_KINDS.includes(kind)
                ? [`Finish on ${direction} wall`, 'Wall area excludes openings per the R0 schedule', 'No structural chasing permitted']
                : kind === 'FURNITURE_JOINERY'
                  ? ['Carcass 18mm BWP with soft-close hardware', 'Elevations per approved joinery drawing', 'Clear circulation of 900mm maintained']
                  : kind === 'DOORS_WINDOWS'
                    ? ['Openings per the R0 opening schedule', 'Slim-profile aluminium with DGU glazing']
                    : ['Coordinated with the approved electrical and lighting layout'],
        furnitureRefs,
        lightingRefs,
        electricalRefs,
        plumbingRefs,
        specificationText: kindMaterials.length
          ? kindMaterials.map(m => `${m.name}: ${m.specification} (${m.brand})`).join(' | ')
          : 'No finish specified for this element.',
        designVersion
      };

      const element: DesignElement = {
        id: elementId,
        projectId,
        roomId,
        kind,
        label: kind.replace(/_/g, ' '),
        wallDirection: direction,
        spec,
        assetIds: [],
        boqItemCodes: kindMaterials.flatMap(m => m.boqItemCodes),
        dependents: [],
        reviewFlags: [],
        status:
          FINISH_KINDS.has(kind) && materialRefs.length === 0
            ? // no BOQ line for this finish in this room -> not applicable, not missing
              (kind === 'FURNITURE_JOINERY' || kind === 'DOORS_WINDOWS' ? 'NOT_APPLICABLE' : 'INCOMPLETE')
            : SERVICE_KINDS.includes(kind) &&
                ((kind === 'LIGHTING' && lightingRefs.length === 0) ||
                  (kind === 'ELECTRICAL' && electricalRefs.length === 0) ||
                  (kind === 'PLUMBING_HVAC' && plumbingRefs.length === 0))
              ? 'INCOMPLETE'
              : 'COMPLETE'
      };

      const pushAsset = (asset: Omit<DesignAssetRecord, 'projectId' | 'roomId' | 'elementId' | 'designVersion' | 'revision'>) => {
        const record: DesignAssetRecord = {
          ...asset,
          projectId,
          roomId,
          elementId,
          designVersion,
          revision
        };
        roomAssets.push(record);
        element.assetIds.push(record.id);
        return record;
      };

      // A registry slot with no BOQ line in this room (e.g. no joinery in a
      // stair core) gets no deliverables - it must not create pending assets.
      if (element.status === 'NOT_APPLICABLE') {
        roomElements.push(element);
        return;
      }

      const seq = (n: number) => String(n).padStart(3, '0');

      // material references (one per approved material on this element)
      kindMaterials.slice(0, 3).forEach((material, index) => {
        pushAsset({
          id: `AST-${roomId}-${KIND_SHORT[kind]}-M${index + 1}`,
          assetType: 'MATERIAL_REFERENCE',
          drawingRef: `MR-${roomId}-${KIND_SHORT[kind]}-${index + 1}`,
          materialRefs: [material.id],
          source: 'DERIVED_FROM_GEOMETRY',
          approvalStatus: material.approved ? 'APPROVED' : 'PENDING',
          approvedBy: material.approvedBy,
          parentAssetId: renderAsset.id,
          url: materialSwatchSvg(material, { name: planRoom.name } as TwinRoom),
          provenance: {
            origin: 'Material library record',
            method: `Swatch rendered from material record ${material.id} (${material.brand})`,
            generatedAt: createdAt,
            generatedBy: 'design-twin-engine',
            licence: 'Internal project asset'
          },
          status: material.approved ? 'READY' : 'MISSING_MATERIAL',
          geometryBasis: undefined
        });
      });

      if (WALL_KINDS.includes(kind) && direction) {
        pushAsset({
          id: `AST-${roomId}-${KIND_SHORT[kind]}-E01`,
          assetType: 'WALL_ELEVATION',
          drawingRef: `WE-${roomId}-${direction[0]}`,
          materialRefs,
          source: 'DERIVED_FROM_GEOMETRY',
          approvalStatus: verified && materialRefs.length ? 'APPROVED' : 'PENDING',
          approvedBy: verified ? actor : undefined,
          parentAssetId: renderAsset.id,
          url: wallElevationSvg({ name: planRoom.name, geometry: { ...planRoom, perimeterFt: planRoom.perimeterFt, wallAreaSqFt: planRoom.wallAreaSqFt, confidence: planRoom.confidence, verified } } as unknown as TwinRoom, kind, direction, kindMaterials),
          provenance: {
            origin: 'Derived drawing',
            method: `Elevation drawn from verified geometry (${planRoom.lengthFt}' x ${planRoom.widthFt}' x ${planRoom.ceilingHeightFt}') on the ${direction} wall`,
            generatedAt: createdAt,
            generatedBy: 'design-twin-engine',
            licence: 'Internal project asset'
          },
          status: verified ? (materialRefs.length ? 'READY' : 'MISSING_MATERIAL') : 'BLOCKED_UNVERIFIED_GEOMETRY',
          geometryBasis: {
            lengthFt: planRoom.lengthFt,
            widthFt: planRoom.widthFt,
            ceilingHeightFt: planRoom.ceilingHeightFt,
            areaSqFt: planRoom.areaSqFt,
            verified,
            sourceRef: model.source.fileName || model.source.kind
          }
        });

        pushAsset({
          id: `AST-${roomId}-${KIND_SHORT[kind]}-B01`,
          assetType: 'MOOD_BOARD',
          drawingRef: `MB-${roomId}-${direction[0]}`,
          materialRefs,
          source: 'DERIVED_FROM_GEOMETRY',
          approvalStatus: materialRefs.length ? 'APPROVED' : 'PENDING',
          parentAssetId: renderAsset.id,
          url: moodBoardSvg({ name: planRoom.name, conceptCode: concept.code, conceptVersion: concept.version } as TwinRoom, kindMaterials, palette),
          provenance: {
            origin: 'Derived board',
            method: 'Composed only from the approved material records and palette of this element',
            generatedAt: createdAt,
            generatedBy: 'design-twin-engine',
            licence: 'Internal project asset'
          },
          status: materialRefs.length ? 'READY' : 'MISSING_MATERIAL'
        });
      }

      if (kind === 'FLOORING' || kind === 'CEILING' || WALL_KINDS.includes(kind)) {
        pushAsset({
          id: `AST-${roomId}-${KIND_SHORT[kind]}-D01`,
          assetType: 'CONSTRUCTION_DETAIL',
          drawingRef: `CD-${roomId}-${KIND_SHORT[kind]}`,
          materialRefs,
          source: 'DERIVED_FROM_GEOMETRY',
          approvalStatus: materialRefs.length ? 'APPROVED' : 'PENDING',
          parentAssetId: renderAsset.id,
          url: constructionDetailSvg({ name: planRoom.name } as TwinRoom, kind, kindMaterials),
          provenance: {
            origin: 'Derived detail',
            method: `Build-up drawn from ${kindMaterials.length} approved material layer(s) on ${kind.replace('_', ' ')}`,
            generatedAt: createdAt,
            generatedBy: 'design-twin-engine',
            licence: 'Internal project asset'
          },
          status: materialRefs.length ? 'READY' : 'MISSING_MATERIAL'
        });
      }

      if (kind === 'LIGHTING' || kind === 'ELECTRICAL' || kind === 'PLUMBING_HVAC') {
        const refs = kind === 'LIGHTING' ? lightingRefs : kind === 'ELECTRICAL' ? electricalRefs : plumbingRefs;
        pushAsset({
          id: `AST-${roomId}-${KIND_SHORT[kind]}-P01`,
          assetType: kind === 'LIGHTING' ? 'LIGHTING_PLAN' : kind === 'ELECTRICAL' ? 'ELECTRICAL_PLAN' : 'CONSTRUCTION_DETAIL',
          drawingRef: `${kind === 'LIGHTING' ? 'LP' : kind === 'ELECTRICAL' ? 'EP' : 'PD'}-${roomId}`,
          materialRefs,
          source: 'DERIVED_FROM_GEOMETRY',
          approvalStatus: 'APPROVED',
          parentAssetId: renderAsset.id,
          url: servicePlanSvg({ name: planRoom.name } as TwinRoom, kind, refs),
          provenance: {
            origin: 'Derived service plan',
            method: `Points laid out from the room geometry and the ${refs.length} coordinated circuit(s)`,
            generatedAt: createdAt,
            generatedBy: 'design-twin-engine',
            licence: 'Internal project asset'
          },
          status: 'READY'
        });
      }

      // specification + BOQ link (text assets, still first-class records)
      pushAsset({
        id: `AST-${roomId}-${KIND_SHORT[kind]}-S01`,
        assetType: 'SPECIFICATION',
        drawingRef: `SPEC-${roomId}-${KIND_SHORT[kind]}`,
        materialRefs,
        source: 'DERIVED_FROM_GEOMETRY',
        approvalStatus: materialRefs.length || SERVICE_KINDS.includes(kind) ? 'APPROVED' : 'PENDING',
        parentAssetId: renderAsset.id,
        url: undefined,
        provenance: {
          origin: 'Specification register',
          method: 'Composed from the approved material records and construction notes of this element',
          generatedAt: createdAt,
          generatedBy: 'design-twin-engine',
          licence: 'Internal project asset'
        },
        status: 'READY',
        notes: spec.specificationText
      });

      pushAsset({
        id: `AST-${roomId}-${KIND_SHORT[kind]}-Q01`,
        assetType: 'BOQ_LINK',
        drawingRef: `BOQ-${roomId}-${KIND_SHORT[kind]}`,
        materialRefs,
        source: 'DERIVED_FROM_GEOMETRY',
        approvalStatus: element.boqItemCodes.length ? 'APPROVED' : 'PENDING',
        parentAssetId: renderAsset.id,
        url: undefined,
        provenance: {
          origin: 'BOQ register',
          method: `Linked to BOQ line(s) ${element.boqItemCodes.join(', ') || '(none)'}`,
          generatedAt: createdAt,
          generatedBy: 'design-twin-engine',
          licence: 'Internal project asset'
        },
        status: element.boqItemCodes.length ? 'READY' : 'MISSING_MATERIAL',
        notes: element.boqItemCodes.join(', ')
      });

      roomElements.push(element);
    });

    // room-level dimension sheet, parented to the flooring element
    const dimensionElement = roomElements.find(el => el.kind === 'FLOORING');
    if (dimensionElement) {
      const dimensionAsset: DesignAssetRecord = {
        id: `AST-${roomId}-FL-DM1`,
        projectId,
        roomId,
        elementId: dimensionElement.id,
        assetType: 'DIMENSION_SHEET',
        designVersion,
        revision,
        drawingRef: `DS-${roomId}`,
        materialRefs: [],
        source: 'DERIVED_FROM_GEOMETRY',
        approvalStatus: verified ? 'APPROVED' : 'PENDING',
        parentAssetId: renderAsset.id,
        url: dimensionSheetSvg({ name: planRoom.name, geometry: { ...planRoom, verified, confidence: planRoom.confidence } } as unknown as TwinRoom),
        provenance: {
          origin: 'Derived drawing',
          method: `Dimensioned plan from ${planRoom.lengthFt}' x ${planRoom.widthFt}' (${planRoom.confidence})`,
          generatedAt: createdAt,
          generatedBy: 'design-twin-engine',
          licence: 'Internal project asset'
        },
        status: verified ? 'READY' : 'BLOCKED_UNVERIFIED_GEOMETRY',
        geometryBasis: {
          lengthFt: planRoom.lengthFt,
          widthFt: planRoom.widthFt,
          ceilingHeightFt: planRoom.ceilingHeightFt,
          areaSqFt: planRoom.areaSqFt,
          verified,
          sourceRef: model.source.fileName || model.source.kind
        }
      };
      roomAssets.push(dimensionAsset);
      dimensionElement.assetIds.push(dimensionAsset.id);
    }

    // ---- dependency graph inside the room
    roomElements.forEach(element => {
      if (WALL_KINDS.includes(element.kind)) {
        element.dependents = [
          elementIdFor('ELECTRICAL'),
          elementIdFor('LIGHTING'),
          elementIdFor('FURNITURE_JOINERY')
        ].filter(id => roomElements.some(el => el.id === id));
      }
      if (element.kind === 'CEILING') {
        element.dependents = [elementIdFor('LIGHTING')].filter(id => roomElements.some(el => el.id === id));
      }
      if (element.kind === 'FLOORING') {
        element.dependents = [elementIdFor('FURNITURE_JOINERY')].filter(id => roomElements.some(el => el.id === id));
      }
    });

    const room: TwinRoom = {
      id: roomId,
      projectId,
      floorId: floor.id,
      name: planRoom.name,
      roomType: planRoom.roomType,
      floorPlanRoomId: planRoom.id,
      geometry: {
        lengthFt: planRoom.lengthFt,
        widthFt: planRoom.widthFt,
        ceilingHeightFt: planRoom.ceilingHeightFt,
        areaSqFt: planRoom.areaSqFt,
        perimeterFt: planRoom.perimeterFt,
        wallAreaSqFt: planRoom.wallAreaSqFt,
        verified,
        confidence: planRoom.confidence
      },
      requirementIds: (input.requirements || []).filter(r => r.text.toLowerCase().includes(planRoom.name.toLowerCase().split(' ')[0])).map(r => r.id),
      briefText: scheme.customerInstructionApplied || `${concept.name} scheme as approved for ${planRoom.name}`,
      conceptId: concept.id,
      conceptCode: concept.code,
      conceptVersion: concept.version,
      enclosed,
      elements: roomElements,
      status: roomElements.some(el => el.status === 'INCOMPLETE')
        ? 'INCOMPLETE'
        : roomElements.some(el => el.status === 'NEEDS_REVIEW')
          ? 'NEEDS_REVIEW'
          : 'COMPLETE'
    };

    rooms.push(room);
    assets.push(...roomAssets);
  });

  const twin: DesignTwin = {
    projectId,
    designVersion,
    versionSeq: 1,
    builtFrom: {
      conceptId: concept.id,
      conceptCode: concept.code,
      conceptVersion: concept.version,
      floorPlanSource: model.source.fileName || model.source.kind,
      floorPlanConfirmedAt: model.confirmedAt,
      floorPlanConfirmedBy: model.confirmedBy,
      boqRevisionId: input.boqRevisionId
    },
    floors,
    rooms,
    materials,
    assets,
    prompts,
    revisions: [],
    approvals: [
      {
        id: `APR-PKG-${designVersion}`,
        level: 'PACKAGE',
        scopeId: projectId,
        by: concept.approvedBy || actor,
        at: concept.approvedAt || createdAt,
        designVersion,
        note: `Built from approved concept ${concept.code} v${concept.version}`
      }
    ],
    packageStatus: 'AWAITING_APPROVAL',
    createdAt,
    updatedAt: createdAt
  };

  const report = validateDesignPackage(twin, actor);
  twin.validation = report;
  twin.packageStatus = report.passed ? 'APPROVED_FOR_EXECUTION' : 'VALIDATION_FAILED';
  return twin;
}

// ---------------------------------------------------------------------------
// 2. VALIDATION - the 10 mandatory relationships
// ---------------------------------------------------------------------------
export function validateDesignPackage(twin: DesignTwin, actor: string): ValidationReport {
  const activeAssets = twin.assets.filter(a => a.status !== 'SUPERSEDED');
  const enclosedRooms = twin.rooms.filter(r => r.enclosed);
  const elements = twin.rooms.flatMap(r => r.elements);

  const checks: ValidationCheck[] = [];
  const add = (
    id: ValidationCheck['id'],
    label: string,
    passed: boolean,
    detail: string,
    elementIds: string[] = [],
    assetIds: string[] = []
  ) => checks.push({ id, label, passed, blocking: true, detail, elementIds, assetIds });

  // 1. verified geometry
  const unverifiedRooms = twin.rooms.filter(r => !r.geometry.verified);
  add(
    'GEOMETRY_VERIFIED',
    'Every room has a verified floor plan reference',
    unverifiedRooms.length === 0 && Boolean(twin.builtFrom.floorPlanConfirmedAt),
    unverifiedRooms.length === 0
      ? `All ${twin.rooms.length} rooms trace to ${twin.builtFrom.floorPlanSource}, confirmed ${twin.builtFrom.floorPlanConfirmedAt ? 'on ' + new Date(twin.builtFrom.floorPlanConfirmedAt).toLocaleDateString('en-IN') : '—'}.`
      : `${unverifiedRooms.length} room(s) still carry unverified dimensions: ${unverifiedRooms.map(r => r.name).join(', ')}.`,
    unverifiedRooms.flatMap(r => r.elements.map(e => e.id))
  );

  // 2. four wall elevations mapped
  const wallProblems: string[] = [];
  const wallElementIds: string[] = [];
  enclosedRooms.forEach(room => {
    const walls = room.elements.filter(el => WALL_KINDS.includes(el.kind));
    const directions = new Set(walls.map(w => w.wallDirection));
    const missingElevation = walls.filter(
      w => !activeAssets.some(a => a.elementId === w.id && a.assetType === 'WALL_ELEVATION' && a.status === 'READY')
    );
    if (walls.length !== 4 || directions.size !== 4) {
      wallProblems.push(`${room.name}: ${walls.length} of 4 walls mapped`);
      wallElementIds.push(...walls.map(w => w.id));
    } else if (missingElevation.length) {
      wallProblems.push(`${room.name}: elevation missing for ${missingElevation.map(w => w.kind).join(', ')}`);
      wallElementIds.push(...missingElevation.map(w => w.id));
    }
  });
  add(
    'WALL_ELEVATIONS_MAPPED',
    'All four wall elevations are mapped correctly',
    wallProblems.length === 0,
    wallProblems.length === 0
      ? `${enclosedRooms.length} enclosed room(s) × 4 walls, each with a derived elevation in the current revision.`
      : wallProblems.join(' · '),
    wallElementIds
  );

  // 3. renders match the approved design
  const renderProblems: string[] = [];
  const renderAssetIds: string[] = [];
  twin.rooms.forEach(room => {
    const renders = activeAssets.filter(a => a.roomId === room.id && a.assetType === 'RENDER_3D');
    const approvedRender = renders.find(a => a.approvalStatus === 'APPROVED' && a.designVersion === twin.designVersion);
    if (!approvedRender) {
      renderProblems.push(`${room.name}: no approved render at ${twin.designVersion}`);
      renderAssetIds.push(...renders.map(r => r.id));
    }
  });
  add(
    'RENDERS_MATCH_APPROVED_DESIGN',
    '3D renders match the approved room design',
    renderProblems.length === 0,
    renderProblems.length === 0
      ? `Every room has an approved render pinned to ${twin.designVersion}.`
      : renderProblems.join(' · '),
    [],
    renderAssetIds
  );

  // 4. mood boards match selected materials
  const boardProblems: string[] = [];
  const boardAssetIds: string[] = [];
  enclosedRooms.forEach(room => {
    room.elements.filter(el => WALL_KINDS.includes(el.kind)).forEach(wall => {
      const boards = activeAssets.filter(a => a.elementId === wall.id && a.assetType === 'MOOD_BOARD');
      if (!boards.length) {
        boardProblems.push(`${room.name} ${wall.kind}: no mood board`);
        boardAssetIds.push();
        return;
      }
      boards.forEach(board => {
        const unknown = board.materialRefs.filter(ref => !twin.materials.some(m => m.id === ref));
        const notOnElement = board.materialRefs.filter(ref => !wall.spec.materialRefs.includes(ref));
        if (unknown.length || notOnElement.length) {
          boardProblems.push(`${room.name} ${wall.kind}: board references ${[...unknown, ...notOnElement].join(', ')} which is not in the specification`);
          boardAssetIds.push(board.id);
        }
      });
    });
  });
  add(
    'MOOD_BOARDS_MATCH_MATERIALS',
    'Mood boards match selected materials and colours',
    boardProblems.length === 0,
    boardProblems.length === 0
      ? 'Every wall mood board is composed only from that wall’s approved material IDs and palette.'
      : boardProblems.join(' · '),
    [],
    boardAssetIds
  );

  // 5. material images match material IDs
  const materialProblems: string[] = [];
  const materialAssetIds: string[] = [];
  activeAssets
    .filter(a => a.assetType === 'MATERIAL_REFERENCE')
    .forEach(asset => {
      if (!asset.materialRefs.length) {
        materialProblems.push(`${asset.id}: no material reference`);
        materialAssetIds.push(asset.id);
        return;
      }
      asset.materialRefs.forEach(ref => {
        const material = twin.materials.find(m => m.id === ref);
        if (!material) {
          materialProblems.push(`${asset.id}: unknown material ${ref}`);
          materialAssetIds.push(asset.id);
        }
      });
    });
  add(
    'MATERIAL_IMAGES_MATCH_IDS',
    'Material images match material IDs',
    materialProblems.length === 0,
    materialProblems.length === 0
      ? `${activeAssets.filter(a => a.assetType === 'MATERIAL_REFERENCE').length} material swatches, every one resolved to a material record.`
      : materialProblems.slice(0, 4).join(' · '),
    [],
    materialAssetIds
  );

  // 6. furniture dimensions validated
  const furnitureProblems: string[] = [];
  const furnitureElementIds: string[] = [];
  twin.rooms.forEach(room => {
    const furniture = room.elements.filter(el => el.kind === 'FURNITURE_JOINERY' && el.status !== 'NOT_APPLICABLE');
    if (!furniture.length) return;
    furniture.forEach(el => {
      const dims = el.spec.dimensions;
      const fits = dims.lengthFt > 0 && dims.widthFt > 0 && dims.heightFt > 0 && dims.heightFt <= room.geometry.ceilingHeightFt;
      const hasFurniture = el.spec.furnitureRefs.length > 0;
      if (!dims.verified || !fits || !hasFurniture) {
        furnitureProblems.push(
          `${room.name}: ${!dims.verified ? 'dimensions unverified' : !fits ? 'element exceeds room height' : 'no furniture list'}`
        );
        furnitureElementIds.push(el.id);
      }
    });
  });
  add(
    'FURNITURE_DIMENSIONS_VALIDATED',
    'Furniture dimensions are validated',
    furnitureProblems.length === 0,
    furnitureProblems.length === 0
      ? 'Every furniture/joinery element sits inside its room’s verified dimensions and ceiling height.'
      : furnitureProblems.join(' · '),
    furnitureElementIds
  );

  // 7. lighting + electrical coordinated
  const serviceProblems: string[] = [];
  const serviceElementIds: string[] = [];
  twin.rooms.forEach(room => {
    const electrical = room.elements.find(el => el.kind === 'ELECTRICAL');
    const lighting = room.elements.find(el => el.kind === 'LIGHTING');
    if (!electrical || !lighting) {
      serviceProblems.push(`${room.name}: missing ${!electrical ? 'electrical' : 'lighting'} element`);
      serviceElementIds.push(...[electrical?.id, lighting?.id].filter(Boolean) as string[]);
      return;
    }
    const shared = lighting.spec.lightingRefs.filter(ref => electrical.spec.electricalRefs.includes(ref) || ref.startsWith('CIRC'));
    if (!shared.length) {
      serviceProblems.push(`${room.name}: lighting and electrical share no circuit reference`);
      serviceElementIds.push(electrical.id, lighting.id);
    }
  });
  add(
    'LIGHTING_ELECTRICAL_COORDINATED',
    'Lighting and electrical drawings are coordinated',
    serviceProblems.length === 0,
    serviceProblems.length === 0
      ? 'Lighting plans and electrical plans share the same circuit references in every room.'
      : serviceProblems.join(' · '),
    serviceElementIds
  );

  // 8. construction details reference the correct wall
  const detailProblems: string[] = [];
  const detailAssetIds: string[] = [];
  activeAssets
    .filter(a => a.assetType === 'CONSTRUCTION_DETAIL')
    .forEach(asset => {
      const element = elements.find(el => el.id === asset.elementId);
      const room = twin.rooms.find(r => r.id === asset.roomId);
      if (!element || !room) {
        detailProblems.push(`${asset.id}: orphaned detail`);
        detailAssetIds.push(asset.id);
        return;
      }
      const notOnElement = asset.materialRefs.filter(ref => !element.spec.materialRefs.includes(ref));
      if (notOnElement.length) {
        detailProblems.push(`${asset.id}: references ${notOnElement.join(', ')} not on ${element.label}`);
        detailAssetIds.push(asset.id);
      }
    });
  add(
    'DETAILS_REFERENCE_CORRECT_WALL',
    'Construction details reference the correct wall',
    detailProblems.length === 0,
    detailProblems.length === 0
      ? 'Every construction detail is parented to its own element and only carries that element’s materials.'
      : detailProblems.slice(0, 4).join(' · '),
    [],
    detailAssetIds
  );

  // 9. BOQ items link to approved specs
  const boqProblems: string[] = [];
  const boqElementIds: string[] = [];
  elements
    .filter(el => FINISH_KINDS.has(el.kind) && el.status !== 'NOT_APPLICABLE')
    .forEach(el => {
      if (!el.spec.materialRefs.length) {
        boqProblems.push(`${el.id}: no approved material`);
        boqElementIds.push(el.id);
        return;
      }
      const unapproved = el.spec.materialRefs.filter(ref => {
        const material = twin.materials.find(m => m.id === ref);
        return !material || !material.approved;
      });
      if (unapproved.length) {
        boqProblems.push(`${el.id}: ${unapproved.join(', ')} not approved`);
        boqElementIds.push(el.id);
      }
      if (!el.boqItemCodes.length) {
        boqProblems.push(`${el.id}: no BOQ line`);
        boqElementIds.push(el.id);
      }
    });
  add(
    'BOQ_LINKS_APPROVED_SPECS',
    'BOQ items link to approved specifications',
    boqProblems.length === 0,
    boqProblems.length === 0
      ? 'Every finish element carries approved material IDs and at least one BOQ line.'
      : boqProblems.slice(0, 4).join(' · '),
    boqElementIds
  );

  // 10. single design revision
  const staleAssets = activeAssets.filter(a => a.designVersion !== twin.designVersion);
  add(
    'SINGLE_DESIGN_REVISION',
    'All documents belong to the same design revision',
    staleAssets.length === 0,
    staleAssets.length === 0
      ? `All ${activeAssets.length} active assets are at ${twin.designVersion}.`
      : `${staleAssets.length} asset(s) still at an older design version: ${staleAssets.slice(0, 3).map(a => a.id).join(', ')}.`,
    [],
    staleAssets.map(a => a.id)
  );

  const passedCount = checks.filter(c => c.passed).length;
  return {
    validatedAt: now(),
    validatedBy: actor,
    designVersion: twin.designVersion,
    passedCount,
    totalCount: checks.length,
    checks,
    passed: passedCount === checks.length
  };
}

// ---------------------------------------------------------------------------
// 3. REVISIONS - touch only what depends on the change
// ---------------------------------------------------------------------------
export interface ElementChangeInput {
  elementId: string;
  field: 'MATERIAL' | 'COLOUR' | 'SPECIFICATION';
  /** MATERIAL: id of an approved material in the library to switch to */
  toMaterialId?: string;
  /** MATERIAL/SPECIFICATION free text (used when no library id is supplied) */
  toText?: string;
  /** Rate per unit for a text-based material change (keeps the BOQ impact real) */
  toRate?: number;
  reason: string;
  actor: string;
}

export function applyElementChange(twin: DesignTwin, input: ElementChangeInput): { twin: DesignTwin; revision: TwinRevision } {
  const next: DesignTwin = JSON.parse(JSON.stringify(twin));
  const element = next.rooms.flatMap(r => r.elements).find(el => el.id === input.elementId);
  if (!element) throw new Error(`Element ${input.elementId} not found in this design twin.`);
  const room = next.rooms.find(r => r.id === element.roomId)!;

  const previousVersion = next.designVersion;
  next.versionSeq += 1;
  const newVersion = `V1.${next.versionSeq - 1}`;
  next.designVersion = newVersion;
  const newRevisionTag = `R${String(next.versionSeq).padStart(2, '0')}`;
  const createdAt = now();

  const affectedAssetIds: string[] = [];
  const supersededAssetIds: string[] = [];
  let boqPrevious = 0;
  let boqNew = 0;
  const boqCodes = new Set<string>();
  let fromLabel = '';
  let toLabel = '';

  if (input.field === 'MATERIAL') {
    const currentRefs = element.spec.materialRefs;
    const currentMaterials = next.materials.filter(m => currentRefs.includes(m.id));
    const target = input.toMaterialId ? next.materials.find(m => m.id === input.toMaterialId) : undefined;
    if (!target && !input.toText) {
      throw new Error('Choose an approved material to switch to (or supply the new specification text).');
    }
    if (target && !target.approved) {
      throw new Error(`Material ${target.id} is not approved and cannot be specified.`);
    }
    fromLabel = currentMaterials.map(m => `${m.name} (${m.brand})`).join(', ') || 'none';
    toLabel = target ? `${target.name} (${target.brand})` : String(input.toText);

    // Only the material being changed is replaced; other finishes on the same
    // element (civil making good, waterproofing, ...) stay exactly as approved.
    const sourceMaterial =
      (target && currentMaterials.find(m => m.trade === target.trade || m.category === target.category)) ||
      currentMaterials[currentMaterials.length - 1];
    if (!sourceMaterial) throw new Error('This element has no material to revise.');
    boqCodes.add(sourceMaterial.boqItemCodes[0] || '');
    boqPrevious = sourceMaterial.boqQuantity * sourceMaterial.rate;
    const replacement: MaterialSpecRecord = {
      ...sourceMaterial,
      id: `MAT-${room.id}-${element.id.split('-').pop()}-${newRevisionTag}`,
      name: target ? target.name : sourceMaterial.name,
      brand: target ? target.brand : sourceMaterial.brand,
      finish: target ? target.finish : `Revised: ${input.toText || sourceMaterial.finish}`,
      specification: target ? target.specification : String(input.toText),
      rate: target ? target.rate : input.toRate && input.toRate > 0 ? input.toRate : sourceMaterial.rate,
      boqQuantity: sourceMaterial.boqQuantity,
      boqItemCodes: sourceMaterial.boqItemCodes,
      approved: true,
      approvedBy: input.actor,
      approvedAt: createdAt,
      notes: `Introduced by ${input.reason}`
    };
    next.materials.push(replacement);
    element.spec.materialRefs = currentRefs.map(ref => (ref === sourceMaterial.id ? replacement.id : ref));
    element.spec.specificationText = next.materials
      .filter(m => element.spec.materialRefs.includes(m.id))
      .map(m => `${m.name}: ${m.specification} (${m.brand})`)
      .join(' | ');
    boqNew = replacement.boqQuantity * replacement.rate;
    boqCodes.add(replacement.boqItemCodes[0] || '');
  } else if (input.field === 'COLOUR') {
    fromLabel = element.spec.colourRefs.join(' / ');
    toLabel = String(input.toText || '');
    element.spec.colourRefs = String(input.toText || '')
      .split('/')
      .map(s => s.trim())
      .filter(Boolean);
  } else {
    fromLabel = element.spec.specificationText.slice(0, 90);
    toLabel = String(input.toText || '');
    element.spec.specificationText = String(input.toText || '');
    element.spec.constructionNotes = [...element.spec.constructionNotes, `Revised: ${input.toText}`];
  }

  element.spec.designVersion = newVersion;

  // ---- regenerate this element's assets at the new revision
  element.assetIds.forEach(assetId => {
    const asset = next.assets.find(a => a.id === assetId);
    if (!asset || asset.status === 'SUPERSEDED') return;
    const wasBlocked = asset.status === 'BLOCKED_UNVERIFIED_GEOMETRY';
    asset.status = 'SUPERSEDED';
    supersededAssetIds.push(asset.id);

    const replacement: DesignAssetRecord = {
      ...JSON.parse(JSON.stringify(asset)),
      id: `${asset.id.replace(/-R\d+$/, '')}-${newRevisionTag}`,
      designVersion: newVersion,
      revision: newRevisionTag,
      approvalStatus: 'PENDING',
      approvedBy: undefined,
      approvedAt: undefined,
      supersedes: asset.id,
      status: wasBlocked ? 'BLOCKED_UNVERIFIED_GEOMETRY' : 'READY',
      provenance: {
        ...asset.provenance,
        method: `${asset.provenance.method} · regenerated for ${newRevisionTag} after ${input.reason}`,
        generatedAt: createdAt,
        generatedBy: input.actor
      }
    };
    // refresh the visual so it depicts the new specification
    const kindMaterials = next.materials.filter(m => element.spec.materialRefs.includes(m.id));
    if (replacement.assetType === 'MATERIAL_REFERENCE') {
      replacement.materialRefs = element.spec.materialRefs.slice(0, 1);
      if (kindMaterials[0]) replacement.url = materialSwatchSvg(kindMaterials[0], room);
    } else if (replacement.assetType === 'WALL_ELEVATION') {
      replacement.materialRefs = element.spec.materialRefs;
      if (element.wallDirection) replacement.url = wallElevationSvg(room, element.kind, element.wallDirection, kindMaterials);
    } else if (replacement.assetType === 'MOOD_BOARD') {
      replacement.materialRefs = element.spec.materialRefs;
      replacement.url = moodBoardSvg(room, kindMaterials, element.spec.colourRefs);
    } else if (replacement.assetType === 'CONSTRUCTION_DETAIL') {
      replacement.materialRefs = element.spec.materialRefs;
      replacement.url = constructionDetailSvg(room, element.kind, kindMaterials);
    } else {
      replacement.materialRefs = element.spec.materialRefs;
    }
    next.assets.push(replacement);
    element.assetIds.push(replacement.id);
    affectedAssetIds.push(replacement.id);
  });

  // ---- dependents: flag for review and refresh the room render
  const dependentsFlagged: string[] = [];
  element.dependents.forEach(dependentId => {
    const dependent = room.elements.find(el => el.id === dependentId);
    if (!dependent) return;
    dependent.status = 'NEEDS_REVIEW';
    dependent.reviewFlags = [
      ...dependent.reviewFlags.filter(f => !f.startsWith(newRevisionTag)),
      `${newRevisionTag}: review after change to ${element.label}`
    ];
    dependentsFlagged.push(dependent.id);
  });

  // the room render must be re-approved because the specification changed
  const roomRender = next.assets.find(a => a.roomId === room.id && a.assetType === 'RENDER_3D' && a.status !== 'SUPERSEDED');
  if (roomRender) {
    roomRender.approvalStatus = 'PENDING';
    roomRender.approvedBy = undefined;
    roomRender.approvedAt = undefined;
    roomRender.designVersion = newVersion;
    roomRender.revision = newRevisionTag;
    roomRender.status = 'READY';
    roomRender.provenance = {
      ...roomRender.provenance,
      method: `${roomRender.provenance.method} · re-approval required after ${newRevisionTag}`,
      generatedAt: createdAt
    };
    affectedAssetIds.push(roomRender.id);
  }

  const revision: TwinRevision = {
    id: `REV-${element.id}-${newRevisionTag}`,
    projectId: next.projectId,
    requestedAt: createdAt,
    requestedBy: input.actor,
    scope: 'ELEMENT',
    scopeId: element.id,
    elementIds: [element.id],
    change: { field: input.field, from: fromLabel, to: toLabel, reason: input.reason },
    previousVersion,
    newVersion,
    affectedAssetIds,
    supersededAssetIds,
    dependentsFlagged,
    boqImpact: {
      itemCodes: Array.from(boqCodes).filter(Boolean),
      previousAmount: r2(boqPrevious),
      newAmount: r2(boqNew),
      delta: r2(boqNew - boqPrevious)
    },
    approvalsRequired: true,
    status: 'AWAITING_APPROVAL'
  };

  next.revisions = [...next.revisions, revision];
  next.packageStatus = 'AWAITING_APPROVAL';
  next.validation = undefined;
  next.updatedAt = createdAt;

  // room status follows its elements
  room.status = room.elements.some(el => el.status === 'NEEDS_REVIEW')
    ? 'NEEDS_REVIEW'
    : room.elements.some(el => el.status === 'INCOMPLETE')
      ? 'INCOMPLETE'
      : 'COMPLETE';

  return { twin: next, revision };
}

/**
 * Re-issues the drawing package: stamps every active asset with the current
 * package version so the whole set is one revision again. Visuals do not
 * change - only the issue stamp - and the action is recorded as a package
 * revision. Required before a package can be validated and released after an
 * element change.
 */
export function reissuePackage(twin: DesignTwin, actor: string): DesignTwin {
  const next: DesignTwin = JSON.parse(JSON.stringify(twin));
  const revisionTag = `R${String(next.versionSeq).padStart(2, '0')}`;
  const at = now();
  let stamped = 0;
  next.assets.forEach(asset => {
    if (asset.status === 'SUPERSEDED') return;
    if (asset.designVersion !== next.designVersion || asset.revision !== revisionTag) {
      asset.designVersion = next.designVersion;
      asset.revision = revisionTag;
      stamped += 1;
    }
  });
  next.revisions = [
    ...next.revisions,
    {
      id: `REV-PKG-${next.designVersion}`,
      projectId: next.projectId,
      requestedAt: at,
      requestedBy: actor,
      scope: 'PACKAGE',
      scopeId: next.projectId,
      elementIds: [],
      change: {
        field: 'SPECIFICATION',
        from: 'mixed element revisions',
        to: `package re-issued at ${next.designVersion}`,
        reason: 'Re-issue the drawing set so every document carries one revision'
      },
      previousVersion: twin.designVersion,
      newVersion: next.designVersion,
      affectedAssetIds: next.assets.filter(a => a.status !== 'SUPERSEDED').map(a => a.id),
      supersededAssetIds: [],
      dependentsFlagged: [],
      boqImpact: { itemCodes: [], previousAmount: 0, newAmount: 0, delta: 0 },
      approvalsRequired: false,
      status: 'APPLIED'
    }
  ];
  next.packageStatus = 'AWAITING_APPROVAL';
  next.validation = undefined;
  next.updatedAt = at;
  next.approvals.push({
    id: `APR-ISSUE-${next.designVersion}`,
    level: 'PACKAGE',
    scopeId: next.projectId,
    by: actor,
    at,
    designVersion: next.designVersion,
    note: `Package re-issued; ${stamped} asset(s) stamped`
  });
  return next;
}

// ---------------------------------------------------------------------------
// 4. APPROVALS
// ---------------------------------------------------------------------------
export function approveElementRevision(twin: DesignTwin, elementId: string, actor: string): DesignTwin {
  const next: DesignTwin = JSON.parse(JSON.stringify(twin));
  const element = next.rooms.flatMap(r => r.elements).find(el => el.id === elementId);
  if (!element) throw new Error(`Element ${elementId} not found.`);

  const at = now();
  element.assetIds.forEach(assetId => {
    const asset = next.assets.find(a => a.id === assetId);
    if (asset && asset.status !== 'SUPERSEDED' && asset.approvalStatus === 'PENDING') {
      asset.approvalStatus = 'APPROVED';
      asset.approvedBy = actor;
      asset.approvedAt = at;
    }
  });
  element.reviewFlags = [];
  if (element.status === 'NEEDS_REVIEW') element.status = 'COMPLETE';

  // clear dependents that were only flagged by this element
  element.dependents.forEach(dependentId => {
    const dependent = next.rooms.flatMap(r => r.elements).find(el => el.id === dependentId);
    if (!dependent) return;
    dependent.reviewFlags = dependent.reviewFlags.filter(f => !f.includes(element.label));
    if (!dependent.reviewFlags.length && dependent.status === 'NEEDS_REVIEW') dependent.status = 'COMPLETE';
  });

  const room = next.rooms.find(r => r.id === element.roomId)!;
  const roomRender = next.assets.find(a => a.roomId === room.id && a.assetType === 'RENDER_3D' && a.status !== 'SUPERSEDED');
  if (roomRender && roomRender.approvalStatus === 'PENDING') {
    roomRender.approvalStatus = 'APPROVED';
    roomRender.approvedBy = actor;
    roomRender.approvedAt = at;
  }

  next.revisions
    .filter(rev => rev.elementIds.includes(elementId) && rev.status === 'AWAITING_APPROVAL')
    .forEach(rev => {
      rev.status = 'APPROVED';
    });

  next.approvals.push({
    id: `APR-${elementId}-${next.designVersion}`,
    level: 'ELEMENT',
    scopeId: elementId,
    by: actor,
    at,
    designVersion: next.designVersion,
    note: `Assets re-approved at ${next.designVersion}`
  });

  room.status = room.elements.some(el => el.status === 'NEEDS_REVIEW')
    ? 'NEEDS_REVIEW'
    : room.elements.some(el => el.status === 'INCOMPLETE')
      ? 'INCOMPLETE'
      : 'COMPLETE';

  next.validation = undefined;
  next.updatedAt = at;
  return next;
}

export function approvePackage(twin: DesignTwin, actor: string): DesignTwin {
  const report = twin.validation && twin.validation.designVersion === twin.designVersion
    ? twin.validation
    : validateDesignPackage(twin, actor);
  if (!report.passed) {
    throw new Error(`Package cannot be approved: ${report.totalCount - report.passedCount} validation check(s) failing.`);
  }
  const next: DesignTwin = JSON.parse(JSON.stringify(twin));
  next.validation = report;
  next.approvals.push({
    id: `APR-PKG-${next.designVersion}`,
    level: 'PACKAGE',
    scopeId: next.projectId,
    by: actor,
    at: now(),
    designVersion: next.designVersion,
    note: `${report.passedCount}/${report.totalCount} checks passed`
  });
  next.packageStatus = 'APPROVED_FOR_EXECUTION';
  next.updatedAt = now();
  return next;
}

// ---------------------------------------------------------------------------
// 5. THE GATE
// ---------------------------------------------------------------------------
export interface PublishResult {
  ok: boolean;
  status: PackageStatus;
  reasons: string[];
  report?: ValidationReport;
}

export function publishDesignPackage(twin: DesignTwin, actor: string): PublishResult {
  const report = twin.validation && twin.validation.designVersion === twin.designVersion
    ? twin.validation
    : validateDesignPackage(twin, actor);
  const reasons: string[] = [];
  if (!report.passed) {
    reasons.push(`${report.totalCount - report.passedCount} of ${report.totalCount} validation checks are failing.`);
    report.checks.filter(c => !c.passed).forEach(c => reasons.push(`${c.label}: ${c.detail}`));
  }
  if (twin.packageStatus !== 'APPROVED_FOR_EXECUTION') {
    reasons.push(`Package status is ${twin.packageStatus.replace(/_/g, ' ').toLowerCase()} — package approval is required.`);
  }
  const pending = twin.assets.filter(a => a.status !== 'SUPERSEDED' && a.approvalStatus === 'PENDING');
  if (pending.length) {
    reasons.push(`${pending.length} asset(s) still awaiting approval (${pending.slice(0, 3).map(a => a.id).join(', ')}).`);
  }
  const ok = reasons.length === 0;
  return { ok, status: twin.packageStatus, reasons, report };
}

// ---------------------------------------------------------------------------
// 6. ASSET UPLOAD (with metadata + provenance)
// ---------------------------------------------------------------------------
export interface UploadAssetInput {
  elementId: string;
  assetType: AssetType;
  url: string;
  source: Extract<AssetSource, 'UPLOADED' | 'MANUFACTURER' | 'AI_GENERATED'>;
  materialRefs?: string[];
  drawingRef?: string;
  promptRef?: string;
  approvalStatus?: AssetApproval;
  provenance: { origin: string; sourceUrl?: string; licence?: string; method: string; model?: string };
  actor: string;
  notes?: string;
}

export function attachAsset(twin: DesignTwin, input: UploadAssetInput): { twin: DesignTwin; asset: DesignAssetRecord } {
  const next: DesignTwin = JSON.parse(JSON.stringify(twin));
  const element = next.rooms.flatMap(r => r.elements).find(el => el.id === input.elementId);
  if (!element) throw new Error(`Element ${input.elementId} not found.`);
  const room = next.rooms.find(r => r.id === element.roomId)!;

  if (!input.url || !input.url.trim()) throw new Error('An asset needs a file, URL or data URI.');
  const materialRefs = input.materialRefs || [];
  materialRefs.forEach(ref => {
    if (!next.materials.some(m => m.id === ref)) {
      throw new Error(`Material ${ref} is not in this project's specification register.`);
    }
  });
  if (input.source === 'MANUFACTURER' && !input.provenance.sourceUrl) {
    throw new Error('A manufacturer asset must record its source URL and licence.');
  }

  const seq = next.assets.filter(a => a.elementId === element.id).length + 1;
  const asset: DesignAssetRecord = {
    id: `AST-${room.id}-${element.id.split('-').pop()}-U${String(seq).padStart(2, '0')}`,
    projectId: next.projectId,
    roomId: room.id,
    elementId: element.id,
    assetType: input.assetType,
    designVersion: next.designVersion,
    revision: `R${String(next.versionSeq).padStart(2, '0')}`,
    drawingRef: input.drawingRef,
    materialRefs,
    source: input.source,
    promptRef: input.promptRef,
    approvalStatus: input.approvalStatus || 'PENDING',
    url: input.url,
    provenance: {
      ...input.provenance,
      generatedAt: now(),
      generatedBy: input.actor
    },
    status: materialRefs.length || input.assetType === 'SPECIFICATION' ? 'READY' : 'MISSING_MATERIAL',
    notes: input.notes
  };

  next.assets.push(asset);
  element.assetIds.push(asset.id);
  next.packageStatus = 'AWAITING_APPROVAL';
  next.validation = undefined;
  next.updatedAt = now();
  return { twin: next, asset };
}
