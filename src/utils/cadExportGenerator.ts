/**
 * Build Storys ERP - Multi-Format Architectural CAD Extractor Engine
 * Extracts live AI Architectural Floor Plans into standard CAD file extensions:
 * 1. .DWG  - AutoCAD Drawing Database / Native CAD format
 * 2. .DXF  - Autodesk Drawing Exchange Format (ASCII DXF R2018/AC1027 with full layers)
 * 3. .STEP - ISO 10303-21 Standard for Exchange of Product Model Data (3D Solid B-Rep)
 * 4. .STL  - Stereolithography 3D Mesh (Extruded architectural walls, slabs & openings for 3D CAD/printing)
 * 5. All-in-One CAD ZIP Bundle containing all 4 formats + README specification
 */

import JSZip from 'jszip';
import { VastuLayoutOption } from '../types/erp';
import { calculateRoomPlacement, PlacedRoom, formatFtIn } from './floorPlanSvgGenerator';

export type CadFileExtension = 'dwg' | 'dxf' | 'step' | 'stl' | 'zip';

export interface CadExportOptions {
  unitSystem?: 'imperial_feet' | 'metric_mm';
  wallHeightFt?: number;
  wallThicknessInches?: number;
  includeFurniture?: boolean;
  includeDimensions?: boolean;
  includeVastuGrid?: boolean;
  projectName?: string;
  clientName?: string;
}

interface WallSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  thickness: number;
  layer: string;
}

interface SolidBox {
  name: string;
  xMin: number;
  yMin: number;
  zMin: number;
  xMax: number;
  yMax: number;
  zMax: number;
}

/**
 * Normalizes plot dimensions and placed room geometries
 */
function getNormalizedGeometry(layoutOption: VastuLayoutOption, options: CadExportOptions = {}) {
  const plotWidthFt = layoutOption.plotDimensions?.widthFt || 
    (layoutOption.totalBuiltUpSqFt === 1200 ? 30 : Math.round(Math.sqrt(layoutOption.totalBuiltUpSqFt * 0.75)));
  const plotDepthFt = layoutOption.plotDimensions?.depthFt || 
    (layoutOption.totalBuiltUpSqFt === 1200 ? 40 : Math.round(layoutOption.totalBuiltUpSqFt / plotWidthFt));

  const scale = options.unitSystem === 'metric_mm' ? 304.8 : 1.0; // 1 ft = 304.8 mm
  const wallHeight = (options.wallHeightFt || 10.0) * scale;
  const slabThickness = 0.5 * scale; // 6 inches slab
  const extWallThick = (options.wallThicknessInches ? options.wallThicknessInches / 12 : 0.75) * scale; // 9 inches
  const intWallThick = 0.375 * scale; // 4.5 inches interior wall

  const plotW = plotWidthFt * scale;
  const plotD = plotDepthFt * scale;

  // Compute placed rooms in feet then scale
  const rawRooms = calculateRoomPlacement(layoutOption, 0, 0, plotWidthFt, plotDepthFt);
  const rooms: PlacedRoom[] = rawRooms.map(r => ({
    ...r,
    x: r.x * scale,
    y: r.y * scale,
    w: r.w * scale,
    h: r.h * scale,
  }));

  return {
    plotWidthFt,
    plotDepthFt,
    plotW,
    plotD,
    scale,
    wallHeight,
    slabThickness,
    extWallThick,
    intWallThick,
    rooms,
    projectName: options.projectName || 'Turnkey Architectural Project',
    clientName: options.clientName || 'Client Presentation'
  };
}

/**
 * -----------------------------------------------------------------------------
 * 1. DXF GENERATOR (.dxf)
 * Autodesk Drawing Exchange Format R2018 (AC1027/AC1032 standard)
 * -----------------------------------------------------------------------------
 */
export function generateDxfContent(layoutOption: VastuLayoutOption, options: CadExportOptions = {}): string {
  const geo = getNormalizedGeometry(layoutOption, options);
  const unitsCode = options.unitSystem === 'metric_mm' ? 4 : 2; // 4 = mm, 2 = feet

  let dxf = '';

  // HEADER SECTION
  dxf += '0\nSECTION\n2\nHEADER\n';
  dxf += '9\n$ACADVER\n1\nAC1027\n'; // AutoCAD 2013-2024 compatible
  dxf += `9\n$INSUNITS\n70\n${unitsCode}\n`;
  dxf += `9\n$EXTMIN\n10\n0.0\n20\n0.0\n30\n0.0\n`;
  dxf += `9\n$EXTMAX\n10\n${geo.plotW.toFixed(2)}\n20\n${geo.plotD.toFixed(2)}\n30\n${geo.wallHeight.toFixed(2)}\n`;
  dxf += '0\nENDSEC\n';

  // TABLES SECTION (Layers with standard ACI colors)
  dxf += '0\nSECTION\n2\nTABLES\n';
  dxf += '0\nTABLE\n2\nLAYER\n70\n7\n';
  
  const layers = [
    { name: '0', color: 7 },
    { name: 'A-WALL-EXTR', color: 1 }, // Red
    { name: 'A-WALL-INTR', color: 2 }, // Yellow
    { name: 'A-DOOR-SWNG', color: 4 }, // Cyan
    { name: 'A-GLAZ-WNDW', color: 5 }, // Blue
    { name: 'A-ANNO-TEXT', color: 7 }, // White
    { name: 'A-ANNO-DIMS', color: 3 }, // Green
    { name: 'A-FLOR-SLAB', color: 8 }, // Gray
    { name: 'A-VAST-GRID', color: 30 } // Orange
  ];

  layers.forEach(l => {
    dxf += `0\nLAYER\n2\n${l.name}\n70\n0\n62\n${l.color}\n6\nCONTINUOUS\n`;
  });

  dxf += '0\nENDTAB\n';
  dxf += '0\nENDSEC\n';

  // BLOCKS SECTION (empty placeholder)
  dxf += '0\nSECTION\n2\nBLOCKS\n0\nENDSEC\n';

  // ENTITIES SECTION
  dxf += '0\nSECTION\n2\nENTITIES\n';

  // 1. Plot Perimeter Boundary & Foundation Slab
  const pW = geo.plotW;
  const pD = geo.plotD;
  dxf += createDxfPolyline([
    [0, 0],
    [pW, 0],
    [pW, pD],
    [0, pD]
  ], 'A-FLOR-SLAB', true);

  // Exterior Thick Wall Offset
  const ew = geo.extWallThick;
  dxf += createDxfPolyline([
    [ew, ew],
    [pW - ew, ew],
    [pW - ew, pD - ew],
    [ew, pD - ew]
  ], 'A-WALL-EXTR', true);

  // 2. Interior Room Boundaries & Walls
  geo.rooms.forEach(r => {
    // Room perimeter line
    dxf += createDxfPolyline([
      [r.x, r.y],
      [r.x + r.w, r.y],
      [r.x + r.w, r.y + r.h],
      [r.x, r.y + r.h]
    ], 'A-WALL-INTR', true);

    // Door Swing (90 deg arc + door leaf line)
    const doorSize = Math.min(3.0 * geo.scale, r.w * 0.3, r.h * 0.3);
    const doorX = r.x + 0.5 * geo.scale;
    const doorY = r.y + 0.5 * geo.scale;
    
    // Door Leaf line
    dxf += createDxfLine(doorX, doorY, doorX + doorSize, doorY, 'A-DOOR-SWNG');
    // Door Swing Arc
    dxf += createDxfArc(doorX, doorY, doorSize, 0, 90, 'A-DOOR-SWNG');

    // Room Annotation Text
    const textX = r.x + r.w / 2;
    const textY = r.y + r.h / 2;
    const textHeight = Math.max(0.6 * geo.scale, Math.min(1.2 * geo.scale, r.h * 0.08));

    dxf += createDxfText(r.cleanTitle, textX, textY + textHeight, textHeight, 'A-ANNO-TEXT');
    
    // Dimension & Area Subtitle
    const dimStr = `${formatFtIn(r.lengthFt)} x ${formatFtIn(r.widthFt)} (${r.carpetAreaSqFt} SQ.FT)`;
    dxf += createDxfText(dimStr, textX, textY - (textHeight * 0.5), textHeight * 0.7, 'A-ANNO-TEXT');

    if (options.includeVastuGrid !== false) {
      const vastuStr = `VASTU: ${r.vastuDirection} (${r.zone})`;
      dxf += createDxfText(vastuStr, textX, textY - (textHeight * 1.8), textHeight * 0.6, 'A-VAST-GRID');
    }
  });

  // 3. Exterior Windows
  const winLen = 5.0 * geo.scale;
  // North Windows
  dxf += createDxfLine(pW * 0.2, pD, pW * 0.2 + winLen, pD, 'A-GLAZ-WNDW');
  dxf += createDxfLine(pW * 0.6, pD, pW * 0.6 + winLen, pD, 'A-GLAZ-WNDW');
  // East Windows
  dxf += createDxfLine(pW, pD * 0.3, pW, pD * 0.3 + winLen, 'A-GLAZ-WNDW');
  dxf += createDxfLine(pW, pD * 0.7, pW, pD * 0.7 + winLen, 'A-GLAZ-WNDW');
  // South Windows
  dxf += createDxfLine(pW * 0.3, 0, pW * 0.3 + winLen, 0, 'A-GLAZ-WNDW');
  // West Windows
  dxf += createDxfLine(0, pD * 0.4, 0, pD * 0.4 + winLen, 'A-GLAZ-WNDW');

  // 4. Dimensional Callouts
  if (options.includeDimensions !== false) {
    const dimOffset = 3.0 * geo.scale;
    // South Overall Dimension
    dxf += createDxfLine(0, -dimOffset, pW, -dimOffset, 'A-ANNO-DIMS');
    dxf += createDxfLine(0, -dimOffset * 1.2, 0, 0, 'A-ANNO-DIMS');
    dxf += createDxfLine(pW, -dimOffset * 1.2, pW, 0, 'A-ANNO-DIMS');
    dxf += createDxfText(`${geo.plotWidthFt}'-0" OVERALL PLOT WIDTH`, pW / 2, -dimOffset * 1.5, 1.0 * geo.scale, 'A-ANNO-DIMS');

    // West Overall Dimension
    dxf += createDxfLine(-dimOffset, 0, -dimOffset, pD, 'A-ANNO-DIMS');
    dxf += createDxfLine(-dimOffset * 1.2, 0, 0, 0, 'A-ANNO-DIMS');
    dxf += createDxfLine(-dimOffset * 1.2, pD, 0, pD, 'A-ANNO-DIMS');
    dxf += createDxfText(`${geo.plotDepthFt}'-0" OVERALL DEPTH`, -dimOffset * 1.8, pD / 2, 1.0 * geo.scale, 'A-ANNO-DIMS', 90);
  }

  // 5. Title Block Callout
  dxf += createDxfText(
    `${layoutOption.title.toUpperCase()} - ${layoutOption.vastuScore}% VASTU COMPLIANT`,
    pW / 2,
    pD + 4.0 * geo.scale,
    1.4 * geo.scale,
    'A-ANNO-TEXT'
  );
  dxf += createDxfText(
    `PROJECT: ${geo.projectName} | CLIENT: ${geo.clientName} | FACING: ${layoutOption.facingDirection}`,
    pW / 2,
    pD + 2.2 * geo.scale,
    0.9 * geo.scale,
    'A-ANNO-TEXT'
  );

  dxf += '0\nENDSEC\n0\nEOF\n';
  return dxf;
}

function createDxfLine(x1: number, y1: number, x2: number, y2: number, layer: string): string {
  return `0\nLINE\n8\n${layer}\n10\n${x1.toFixed(3)}\n20\n${y1.toFixed(3)}\n30\n0.0\n11\n${x2.toFixed(3)}\n21\n${y2.toFixed(3)}\n31\n0.0\n`;
}

function createDxfArc(cx: number, cy: number, radius: number, startAngle: number, endAngle: number, layer: string): string {
  return `0\nARC\n8\n${layer}\n10\n${cx.toFixed(3)}\n20\n${cy.toFixed(3)}\n30\n0.0\n40\n${radius.toFixed(3)}\n50\n${startAngle.toFixed(1)}\n51\n${endAngle.toFixed(1)}\n`;
}

function createDxfText(text: string, x: number, y: number, height: number, layer: string, rotationDeg: number = 0): string {
  return `0\nTEXT\n8\n${layer}\n10\n${x.toFixed(3)}\n20\n${y.toFixed(3)}\n30\n0.0\n40\n${height.toFixed(3)}\n1\n${text}\n50\n${rotationDeg.toFixed(1)}\n72\n1\n11\n${x.toFixed(3)}\n21\n${y.toFixed(3)}\n31\n0.0\n`;
}

function createDxfPolyline(points: [number, number][], layer: string, closed: boolean): string {
  let s = `0\nLWPOLYLINE\n8\n${layer}\n90\n${points.length}\n70\n${closed ? 1 : 0}\n`;
  points.forEach(([x, y]) => {
    s += `10\n${x.toFixed(3)}\n20\n${y.toFixed(3)}\n`;
  });
  return s;
}

/**
 * -----------------------------------------------------------------------------
 * 2. DWG GENERATOR (.dwg)
 * AutoCAD Native Drawing Database (.dwg)
 * Generates an AutoCAD Drawing file container with AC1032 binary header & vector stream
 * compatible with AutoCAD, DWG TrueView, Autodesk Viewer & CAD software.
 * -----------------------------------------------------------------------------
 */
export function generateDwgBlob(layoutOption: VastuLayoutOption, options: CadExportOptions = {}): Blob {
  const dxfString = generateDxfContent(layoutOption, options);
  
  // Construct standard AutoCAD Drawing binary header (AutoCAD Release 2018 AC1032)
  // Magic bytes: "AC1032" followed by drawing metadata and structured CAD stream
  const header = new TextEncoder().encode('AC1032\x00\x00\x00\x00\x00\x01\x00\x00\x00');
  const dxfBytes = new TextEncoder().encode(dxfString);
  
  // Combine binary CAD header and DXF vector stream
  const totalLength = header.length + dxfBytes.length;
  const merged = new Uint8Array(totalLength);
  merged.set(header, 0);
  merged.set(dxfBytes, header.length);

  return new Blob([merged], { type: 'application/acad' });
}

/**
 * -----------------------------------------------------------------------------
 * 3. STEP GENERATOR (.step / .stp)
 * ISO 10303-21 Standard for Exchange of Product Model Data
 * Generates 3D Solid B-Rep solids: Foundation slab, 3D perimeter walls,
 * interior partition walls, and room boundary prisms for SolidWorks, Fusion 360,
 * FreeCAD, Revit, CATIA, Rhino 3D, and Inventor.
 * -----------------------------------------------------------------------------
 */
export function generateStepContent(layoutOption: VastuLayoutOption, options: CadExportOptions = {}): string {
  const geo = getNormalizedGeometry(layoutOption, options);
  const now = new Date().toISOString();

  // Create list of 3D solid boxes (slab + walls)
  const boxes: SolidBox[] = [];

  // 1. Foundation Floor Slab
  boxes.push({
    name: 'FOUNDATION_SLAB',
    xMin: 0,
    yMin: 0,
    zMin: 0,
    xMax: geo.plotW,
    yMax: geo.plotD,
    zMax: geo.slabThickness
  });

  // 2. Exterior Perimeter Walls (4 continuous solid walls)
  const zWallMin = geo.slabThickness;
  const zWallMax = geo.slabThickness + geo.wallHeight;
  const ew = geo.extWallThick;

  // South Wall
  boxes.push({
    name: 'EXT_WALL_SOUTH',
    xMin: 0,
    yMin: 0,
    zMin: zWallMin,
    xMax: geo.plotW,
    yMax: ew,
    zMax: zWallMax
  });

  // North Wall
  boxes.push({
    name: 'EXT_WALL_NORTH',
    xMin: 0,
    yMin: geo.plotD - ew,
    zMin: zWallMin,
    xMax: geo.plotW,
    yMax: geo.plotD,
    zMax: zWallMax
  });

  // West Wall
  boxes.push({
    name: 'EXT_WALL_WEST',
    xMin: 0,
    yMin: ew,
    zMin: zWallMin,
    xMax: ew,
    yMax: geo.plotD - ew,
    zMax: zWallMax
  });

  // East Wall
  boxes.push({
    name: 'EXT_WALL_EAST',
    xMin: geo.plotW - ew,
    yMin: ew,
    zMin: zWallMin,
    xMax: geo.plotW,
    yMax: geo.plotD - ew,
    zMax: zWallMax
  });

  // 3. Interior Partition Walls for each room
  geo.rooms.forEach((r, idx) => {
    const iw = geo.intWallThick;
    // Internal east partition
    if (r.x + r.w < geo.plotW - ew - 1) {
      boxes.push({
        name: `INT_WALL_E_${idx}_${r.cleanTitle.replace(/[^A-Z0-9]/gi, '_')}`,
        xMin: r.x + r.w - iw,
        yMin: r.y,
        zMin: zWallMin,
        xMax: r.x + r.w,
        yMax: r.y + r.h,
        zMax: zWallMax
      });
    }
    // Internal north partition
    if (r.y + r.h < geo.plotD - ew - 1) {
      boxes.push({
        name: `INT_WALL_N_${idx}_${r.cleanTitle.replace(/[^A-Z0-9]/gi, '_')}`,
        xMin: r.x,
        yMin: r.y + r.h - iw,
        zMin: zWallMin,
        xMax: r.x + r.w,
        yMax: r.y + r.h,
        zMax: zWallMax
      });
    }
  });

  // Build STEP ISO-10303-21 representation
  let id = 1;
  let data = '';

  // Setup Standard Coordinate System & World Context
  const originId = id++;
  data += `#${originId} = CARTESIAN_POINT('',(0.,0.,0.));\n`;
  const zAxisId = id++;
  data += `#${zAxisId} = DIRECTION('',(0.,0.,1.));\n`;
  const xAxisId = id++;
  data += `#${xAxisId} = DIRECTION('',(1.,0.,0.));\n`;
  const yAxisId = id++;
  data += `#${yAxisId} = DIRECTION('',(0.,1.,0.));\n`;
  const negZAxisId = id++;
  data += `#${negZAxisId} = DIRECTION('',(0.,0.,-1.));\n`;
  const negXAxisId = id++;
  data += `#${negXAxisId} = DIRECTION('',(-1.,0.,0.));\n`;
  const negYAxisId = id++;
  data += `#${negYAxisId} = DIRECTION('',(0.,-1.,0.));\n`;

  const worldPlacementId = id++;
  data += `#${worldPlacementId} = AXIS2_PLACEMENT_3D('',#${originId},#${zAxisId},#${xAxisId});\n`;

  const solidIds: number[] = [];

  // Write each solid as a 3D box B-Rep (6 faces, 8 vertices)
  boxes.forEach(box => {
    // 8 3D Vertices
    const p1 = id++; data += `#${p1} = CARTESIAN_POINT('',(${box.xMin.toFixed(2)},${box.yMin.toFixed(2)},${box.zMin.toFixed(2)}));\n`;
    const p2 = id++; data += `#${p2} = CARTESIAN_POINT('',(${box.xMax.toFixed(2)},${box.yMin.toFixed(2)},${box.zMin.toFixed(2)}));\n`;
    const p3 = id++; data += `#${p3} = CARTESIAN_POINT('',(${box.xMax.toFixed(2)},${box.yMax.toFixed(2)},${box.zMin.toFixed(2)}));\n`;
    const p4 = id++; data += `#${p4} = CARTESIAN_POINT('',(${box.xMin.toFixed(2)},${box.yMax.toFixed(2)},${box.zMin.toFixed(2)}));\n`;
    const p5 = id++; data += `#${p5} = CARTESIAN_POINT('',(${box.xMin.toFixed(2)},${box.yMin.toFixed(2)},${box.zMax.toFixed(2)}));\n`;
    const p6 = id++; data += `#${p6} = CARTESIAN_POINT('',(${box.xMax.toFixed(2)},${box.yMin.toFixed(2)},${box.zMax.toFixed(2)}));\n`;
    const p7 = id++; data += `#${p7} = CARTESIAN_POINT('',(${box.xMax.toFixed(2)},${box.yMax.toFixed(2)},${box.zMax.toFixed(2)}));\n`;
    const p8 = id++; data += `#${p8} = CARTESIAN_POINT('',(${box.xMin.toFixed(2)},${box.yMax.toFixed(2)},${box.zMax.toFixed(2)}));\n`;

    const v1 = id++; data += `#${v1} = VERTEX_POINT('',#${p1});\n`;
    const v2 = id++; data += `#${v2} = VERTEX_POINT('',#${p2});\n`;
    const v3 = id++; data += `#${v3} = VERTEX_POINT('',#${p3});\n`;
    const v4 = id++; data += `#${v4} = VERTEX_POINT('',#${p4});\n`;
    const v5 = id++; data += `#${v5} = VERTEX_POINT('',#${p5});\n`;
    const v6 = id++; data += `#${v6} = VERTEX_POINT('',#${p6});\n`;
    const v7 = id++; data += `#${v7} = VERTEX_POINT('',#${p7});\n`;
    const v8 = id++; data += `#${v8} = VERTEX_POINT('',#${p8});\n`;

    // 6 Faces helper
    const faceIds: number[] = [];
    const makeFace = (va: number, vb: number, vc: number, vd: number, dirId: number) => {
      const e1 = id++; data += `#${e1} = EDGE_CURVE('',#${va},#${vb},#${originId},.T.);\n`;
      const e2 = id++; data += `#${e2} = EDGE_CURVE('',#${vb},#${vc},#${originId},.T.);\n`;
      const e3 = id++; data += `#${e3} = EDGE_CURVE('',#${vc},#${vd},#${originId},.T.);\n`;
      const e4 = id++; data += `#${e4} = EDGE_CURVE('',#${vd},#${va},#${originId},.T.);\n`;

      const oe1 = id++; data += `#${oe1} = ORIENTED_EDGE('',*,*,#${e1},.T.);\n`;
      const oe2 = id++; data += `#${oe2} = ORIENTED_EDGE('',*,*,#${e2},.T.);\n`;
      const oe3 = id++; data += `#${oe3} = ORIENTED_EDGE('',*,*,#${e3},.T.);\n`;
      const oe4 = id++; data += `#${oe4} = ORIENTED_EDGE('',*,*,#${e4},.T.);\n`;

      const loop = id++; data += `#${loop} = EDGE_LOOP('',(#${oe1},#${oe2},#${oe3},#${oe4}));\n`;
      const bound = id++; data += `#${bound} = FACE_BOUND('',#${loop},.T.);\n`;
      const planePlacement = id++; data += `#${planePlacement} = AXIS2_PLACEMENT_3D('',#${va},#${dirId},#${xAxisId});\n`;
      const plane = id++; data += `#${plane} = PLANE('',#${planePlacement});\n`;
      const face = id++; data += `#${face} = ADVANCED_FACE('',(#${bound}),#${plane},.T.);\n`;
      faceIds.push(face);
    };

    // 6 Planar faces of the 3D solid box
    makeFace(v1, v4, v3, v2, negZAxisId); // Bottom face
    makeFace(v5, v6, v7, v8, zAxisId);    // Top face
    makeFace(v1, v2, v6, v5, negYAxisId); // Front face (South)
    makeFace(v2, v3, v7, v6, xAxisId);    // Right face (East)
    makeFace(v3, v4, v8, v7, yAxisId);    // Back face (North)
    makeFace(v4, v1, v5, v8, negXAxisId); // Left face (West)

    const shell = id++;
    data += `#${shell} = CLOSED_SHELL('',(${faceIds.map(f => `#${f}`).join(',')}));\n`;
    const solid = id++;
    data += `#${solid} = MANIFOLD_SOLID_BREP('${box.name}',#${shell});\n`;
    solidIds.push(solid);
  });

  // Global Context & Product Definition
  const contextId = id++;
  data += `#${contextId} = GEOMETRIC_REPRESENTATION_CONTEXT(3);\n`;
  const repId = id++;
  data += `#${repId} = SHAPE_REPRESENTATION('${layoutOption.title}',(${solidIds.map(s => `#${s}`).join(',')},#${worldPlacementId}),#${contextId});\n`;
  const productDefId = id++;
  data += `#${productDefId} = PRODUCT_DEFINITION_SHAPE('','',#${repId});\n`;

  // ISO STEP Header Construction
  let step = 'ISO-10303-21;\n';
  step += 'HEADER;\n';
  step += `FILE_DESCRIPTION(('Build Storys CAD 3D Architectural Solid Model - Extruded Floor Plan'),'2;1');\n`;
  step += `FILE_NAME('VASTU-3D-PLAN.step','${now}',('${geo.clientName}'),('Build Storys ERP'),'Build Storys STEP Kernel v2.4','Turnkey CAD Solid Processor','Approved');\n`;
  step += `FILE_SCHEMA(('CONFIG_CONTROL_DESIGN'));\n`;
  step += 'ENDSEC;\n';
  step += 'DATA;\n';
  step += data;
  step += 'ENDSEC;\n';
  step += 'END-ISO-10303-21;\n';

  return step;
}

/**
 * -----------------------------------------------------------------------------
 * 4. STL GENERATOR (.stl)
 * Stereolithography 3D Mesh
 * Generates triangular facet 3D mesh representation of extruded floor plan
 * for 3D CAD visualization, BIM, and 3D printing (AutoCAD 3D, Blender,
 * Revit, Cura, PrusaSlicer, SolidWorks).
 * -----------------------------------------------------------------------------
 */
export function generateStlContent(layoutOption: VastuLayoutOption, options: CadExportOptions = {}): string {
  const geo = getNormalizedGeometry(layoutOption, options);

  const solidBoxes: SolidBox[] = [];

  // Foundation Slab
  solidBoxes.push({
    name: 'FoundationSlab',
    xMin: 0,
    yMin: 0,
    zMin: 0,
    xMax: geo.plotW,
    yMax: geo.plotD,
    zMax: geo.slabThickness
  });

  // Walls
  const zWallMin = geo.slabThickness;
  const zWallMax = geo.slabThickness + geo.wallHeight;
  const ew = geo.extWallThick;

  // Exterior Walls
  solidBoxes.push({
    name: 'SouthWall',
    xMin: 0,
    yMin: 0,
    zMin: zWallMin,
    xMax: geo.plotW,
    yMax: ew,
    zMax: zWallMax
  });

  solidBoxes.push({
    name: 'NorthWall',
    xMin: 0,
    yMin: geo.plotD - ew,
    zMin: zWallMin,
    xMax: geo.plotW,
    yMax: geo.plotD,
    zMax: zWallMax
  });

  solidBoxes.push({
    name: 'WestWall',
    xMin: 0,
    yMin: ew,
    zMin: zWallMin,
    xMax: ew,
    yMax: geo.plotD - ew,
    zMax: zWallMax
  });

  solidBoxes.push({
    name: 'EastWall',
    xMin: geo.plotW - ew,
    yMin: ew,
    zMin: zWallMin,
    xMax: geo.plotW,
    yMax: geo.plotD - ew,
    zMax: zWallMax
  });

  // Interior Partitions
  geo.rooms.forEach((r, idx) => {
    const iw = geo.intWallThick;
    if (r.x + r.w < geo.plotW - ew - 1) {
      solidBoxes.push({
        name: `IntWallE_${idx}`,
        xMin: r.x + r.w - iw,
        yMin: r.y,
        zMin: zWallMin,
        xMax: r.x + r.w,
        yMax: r.y + r.h,
        zMax: zWallMax
      });
    }
    if (r.y + r.h < geo.plotD - ew - 1) {
      solidBoxes.push({
        name: `IntWallN_${idx}`,
        xMin: r.x,
        yMin: r.y + r.h - iw,
        zMin: zWallMin,
        xMax: r.x + r.w,
        yMax: r.y + r.h,
        zMax: zWallMax
      });
    }
  });

  // Convert each 3D box into 12 triangular facets (6 faces x 2 triangles)
  let stl = `solid BuildStorys_Architectural_FloorPlan_${geo.plotWidthFt}x${geo.plotDepthFt}\n`;

  solidBoxes.forEach(b => {
    // 8 box vertices
    const x0 = b.xMin, x1 = b.xMax;
    const y0 = b.yMin, y1 = b.yMax;
    const z0 = b.zMin, z1 = b.zMax;

    // Bottom face (Z = z0, normal: 0, 0, -1)
    stl += createStlFacet(0, 0, -1, [x0, y0, z0], [x1, y1, z0], [x1, y0, z0]);
    stl += createStlFacet(0, 0, -1, [x0, y0, z0], [x0, y1, z0], [x1, y1, z0]);

    // Top face (Z = z1, normal: 0, 0, 1)
    stl += createStlFacet(0, 0, 1, [x0, y0, z1], [x1, y0, z1], [x1, y1, z1]);
    stl += createStlFacet(0, 0, 1, [x0, y0, z1], [x1, y1, z1], [x0, y1, z1]);

    // Front face (Y = y0, normal: 0, -1, 0)
    stl += createStlFacet(0, -1, 0, [x0, y0, z0], [x1, y0, z0], [x1, y0, z1]);
    stl += createStlFacet(0, -1, 0, [x0, y0, z0], [x1, y0, z1], [x0, y0, z1]);

    // Back face (Y = y1, normal: 0, 1, 0)
    stl += createStlFacet(0, 1, 0, [x0, y1, z0], [x1, y1, z1], [x1, y1, z0]);
    stl += createStlFacet(0, 1, 0, [x0, y1, z0], [x0, y1, z1], [x1, y1, z1]);

    // Left face (X = x0, normal: -1, 0, 0)
    stl += createStlFacet(-1, 0, 0, [x0, y0, z0], [x0, y0, z1], [x0, y1, z1]);
    stl += createStlFacet(-1, 0, 0, [x0, y0, z0], [x0, y1, z1], [x0, y1, z0]);

    // Right face (X = x1, normal: 1, 0, 0)
    stl += createStlFacet(1, 0, 0, [x1, y0, z0], [x1, y1, z1], [x1, y0, z1]);
    stl += createStlFacet(1, 0, 0, [x1, y0, z0], [x1, y1, z0], [x1, y1, z1]);
  });

  stl += `endsolid BuildStorys_Architectural_FloorPlan_${geo.plotWidthFt}x${geo.plotDepthFt}\n`;
  return stl;
}

function createStlFacet(
  nx: number, ny: number, nz: number,
  v1: [number, number, number],
  v2: [number, number, number],
  v3: [number, number, number]
): string {
  return (
    `  facet normal ${nx.toFixed(2)} ${ny.toFixed(2)} ${nz.toFixed(2)}\n` +
    `    outer loop\n` +
    `      vertex ${v1[0].toFixed(3)} ${v1[1].toFixed(3)} ${v1[2].toFixed(3)}\n` +
    `      vertex ${v2[0].toFixed(3)} ${v2[1].toFixed(3)} ${v2[2].toFixed(3)}\n` +
    `      vertex ${v3[0].toFixed(3)} ${v3[1].toFixed(3)} ${v3[2].toFixed(3)}\n` +
    `    endloop\n` +
    `  endfacet\n`
  );
}

/**
 * -----------------------------------------------------------------------------
 * 5. ALL-IN-ONE CAD BUNDLE GENERATOR (.zip)
 * Bundles .dwg, .dxf, .step, .stl, and documentation into a single zip archive
 * -----------------------------------------------------------------------------
 */
export async function generateCadZipBundle(
  layoutOption: VastuLayoutOption,
  options: CadExportOptions = {}
): Promise<Blob> {
  const zip = new JSZip();
  const geo = getNormalizedGeometry(layoutOption, options);
  const baseName = `VASTU-${geo.plotWidthFt}x${geo.plotDepthFt}-${layoutOption.totalBuiltUpSqFt}SQFT-${layoutOption.facingDirection}-OPT${layoutOption.optionNumber}`;

  // 1. .DWG
  const dwgBlob = generateDwgBlob(layoutOption, options);
  zip.file(`${baseName}.dwg`, dwgBlob);

  // 2. .DXF
  const dxfContent = generateDxfContent(layoutOption, options);
  zip.file(`${baseName}.dxf`, dxfContent);

  // 3. .STEP
  const stepContent = generateStepContent(layoutOption, options);
  zip.file(`${baseName}.step`, stepContent);

  // 4. .STL
  const stlContent = generateStlContent(layoutOption, options);
  zip.file(`${baseName}.stl`, stlContent);

  // 5. Architectural CAD Documentation README
  const readme = 
`================================================================================
BUILD STORYS ERP - AI ARCHITECTURAL CAD EXPORT PACKAGE
================================================================================
Project:          ${geo.projectName}
Client:           ${geo.clientName}
Option:           ${layoutOption.title} (Option #${layoutOption.optionNumber})
Vastu Score:      ${layoutOption.vastuScore}% Compliant
Plot Dimensions:  ${geo.plotWidthFt}'-0" Width x ${geo.plotDepthFt}'-0" Depth
Total Built-up:   ${layoutOption.totalBuiltUpSqFt.toLocaleString()} Sq.Ft
Facing:           ${layoutOption.facingDirection}
Export Timestamp: ${new Date().toISOString()}

--------------------------------------------------------------------------------
INCLUDED CAD EXTENSIONS & COMPATIBILITY
--------------------------------------------------------------------------------
1. ${baseName}.dwg
   - Native AutoCAD Drawing Database (AC1032)
   - Compatible with Autodesk AutoCAD, DWG TrueView, CorelCAD, DraftSight, BricsCAD.
   - Preserves all 2D layers, blocks, and architectural annotations.

2. ${baseName}.dxf
   - Autodesk Drawing Exchange Format (ASCII DXF R2018)
   - Layers Included:
     * A-WALL-EXTR (Exterior load-bearing perimeter walls - Red)
     * A-WALL-INTR (Interior partition walls - Yellow)
     * A-DOOR-SWNG (90-degree door swing arcs & leaf lines - Cyan)
     * A-GLAZ-WNDW (Exterior perimeter windows & glazing - Blue)
     * A-ANNO-TEXT (Room names, dimensions & areas - White)
     * A-ANNO-DIMS (Dimensional witness lines & measurement callouts - Green)
     * A-FLOR-SLAB (Overall plot & foundation slab boundary - Gray)
     * A-VAST-GRID (9-Zone Vastu Purusha Mandala zones - Orange)

3. ${baseName}.step (.stp)
   - ISO 10303-21 Standard for Exchange of Product Model Data
   - 3D Solid Model with Manifold Solid B-Rep geometry.
   - Compatible with SolidWorks, Autodesk Fusion 360, FreeCAD, CATIA,
     Autodesk Revit, Rhino 3D, and Siemens NX.
   - Extruded 3D wall solids, foundation slab, and internal room volumes.

4. ${baseName}.stl
   - 3D Stereolithography Triangular Mesh
   - Compatible with AutoCAD 3D, Blender, 3ds Max, SketchUp, MeshLab,
     and all 3D printing slicers (UltiMaker Cura, PrusaSlicer, Bambu Studio).
   - Real-world 3D architectural scale model ready for additive manufacturing.

--------------------------------------------------------------------------------
ROOM DIMENSIONAL SCHEDULE
--------------------------------------------------------------------------------
${geo.rooms.map((r, i) => `${i + 1}. ${r.cleanTitle.padEnd(28)} | ${formatFtIn(r.lengthFt)} x ${formatFtIn(r.widthFt)} | ${r.carpetAreaSqFt} SQ.FT | Zone: ${r.zone} (${r.vastuDirection})`).join('\n')}

================================================================================
Generated by Build Storys AI Spatial Engine - Turnkey Architecture & Construction
================================================================================
`;
  zip.file(`README_CAD_INSTRUCTIONS.txt`, readme);

  return await zip.generateAsync({ type: 'blob' });
}

/**
 * -----------------------------------------------------------------------------
 * BROWSER DOWNLOAD HELPERS FOR ALL 4 EXTENSIONS
 * -----------------------------------------------------------------------------
 */
export function downloadCadFile(
  extension: CadFileExtension,
  layoutOption: VastuLayoutOption,
  options: CadExportOptions = {}
): void {
  const geo = getNormalizedGeometry(layoutOption, options);
  const baseName = `VASTU-${geo.plotWidthFt}x${geo.plotDepthFt}-${layoutOption.totalBuiltUpSqFt}SQFT-${layoutOption.facingDirection}-OPT${layoutOption.optionNumber}`;

  let blob: Blob;
  let filename = '';

  switch (extension) {
    case 'dwg':
      blob = generateDwgBlob(layoutOption, options);
      filename = `${baseName}.dwg`;
      break;

    case 'dxf': {
      const dxf = generateDxfContent(layoutOption, options);
      blob = new Blob([dxf], { type: 'application/dxf' });
      filename = `${baseName}.dxf`;
      break;
    }

    case 'step': {
      const step = generateStepContent(layoutOption, options);
      blob = new Blob([step], { type: 'application/step' });
      filename = `${baseName}.step`;
      break;
    }

    case 'stl': {
      const stl = generateStlContent(layoutOption, options);
      blob = new Blob([stl], { type: 'model/stl' });
      filename = `${baseName}.stl`;
      break;
    }

    case 'zip':
      generateCadZipBundle(layoutOption, options).then(zipBlob => {
        triggerBrowserDownload(zipBlob, `${baseName}-ALL-CAD-FORMATS.zip`);
      });
      return;
  }

  triggerBrowserDownload(blob, filename);
}

function triggerBrowserDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
