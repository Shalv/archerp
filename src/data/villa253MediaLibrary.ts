/**
 * Build Storys ERP - VILLA 253 PROJECT MEDIA LIBRARY
 * =================================================
 * Every image and drawing that belongs to Villa 253, with the room or floor it
 * depicts, its type, its provenance and its licence.
 *
 * This is the ONLY place the app is allowed to take a picture from. Nothing is
 * stock, nothing is fetched at random: an asset either comes from this register
 * or is derived from a record (SVG elevation, swatch, mood board, plan).
 */

import { VILLA253_ASSETS } from './villa253DemoProject';

export type MediaKind = 'PHOTOGRAPH' | 'RENDER' | 'CAD_DRAWING' | 'PLAN_SHEET' | 'SKETCH';

export interface ProjectMediaItem {
  id: string;
  title: string;
  kind: MediaKind;
  url: string;
  /** Floor plan room id this media depicts, or 'PROJECT' for whole-villa media */
  roomRef: string;
  roomTypes: string[];
  /** Which element the picture is evidence for, when it is element specific */
  elementHint?: 'RENDER_3D' | 'REFERENCE_IMAGE' | 'WALL_ELEVATION' | 'DIMENSION_SHEET';
  description: string;
  provenance: {
    origin: string;
    sourceUrl?: string;
    licence: string;
    method: string;
  };
}

/**
 * The eight project photographs, the four CAD sheets, the site sketch and the
 * two CAD downloads - mapped to the spaces they actually show.
 */
export const VILLA253_MEDIA_LIBRARY: ProjectMediaItem[] = [
  {
    id: 'MED-V253-01',
    title: 'Villa 253 - North facade with the 27ft SD1 portal',
    kind: 'PHOTOGRAPH',
    url: VILLA253_ASSETS.facade,
    roomRef: 'PROJECT',
    roomTypes: [],
    elementHint: 'REFERENCE_IMAGE',
    description: 'Exterior view of the north-facing 24-type villa; shows the SD1 great-room glazing and the first-floor balcony.',
    provenance: {
      origin: 'Villa 253 project photographic set',
      licence: 'Project asset - internal and client presentation use',
      method: 'Site photograph taken for the project record'
    }
  },
  {
    id: 'MED-V253-02',
    title: 'Great room - open living and dining with the SD1 view',
    kind: 'RENDER',
    url: VILLA253_ASSETS.livingGreatroom,
    roomRef: 'ROOM-V253-LIV-01',
    roomTypes: ['LIVING'],
    elementHint: 'RENDER_3D',
    description: 'Approved great-room view: 25\'-4" x 19\'-0", cove ceiling, marble floor and the full-height SD1 opening.',
    provenance: {
      origin: 'Villa 253 approved render set (Concept A)',
      licence: 'Project asset - approved by the client',
      method: 'Approved concept render for the great room'
    }
  },
  {
    id: 'MED-V253-03',
    title: 'Great room - alternate evening palette',
    kind: 'RENDER',
    url: VILLA253_ASSETS.livingModern,
    roomRef: 'ROOM-V253-LIV-01',
    roomTypes: ['LIVING'],
    elementHint: 'REFERENCE_IMAGE',
    description: 'Same room, warmer evening palette - used as the mood reference for the joinery and lighting scene.',
    provenance: {
      origin: 'Villa 253 approved render set (Concept A)',
      licence: 'Project asset - approved by the client',
      method: 'Second approved view of the great room'
    }
  },
  {
    id: 'MED-V253-04',
    title: 'Master Bedroom 1 - suite view with the Wall A feature',
    kind: 'RENDER',
    url: VILLA253_ASSETS.masterSuite,
    roomRef: 'ROOM-V253-BED1-01',
    roomTypes: ['MASTER_BEDROOM'],
    elementHint: 'RENDER_3D',
    description: 'Approved master suite view: 14\'-0" x 19\'-0", Wall A behind the bed, walk-in wardrobe to the south.',
    provenance: {
      origin: 'Villa 253 approved render set (Concept A)',
      licence: 'Project asset - approved by the client',
      method: 'Approved concept render for the master suite'
    }
  },
  {
    id: 'MED-V253-05',
    title: 'Master Bedroom 1 - bed wall study',
    kind: 'RENDER',
    url: VILLA253_ASSETS.masterBedroom,
    roomRef: 'ROOM-V253-BED1-01',
    roomTypes: ['MASTER_BEDROOM'],
    elementHint: 'REFERENCE_IMAGE',
    description: 'Close study of the bed wall - the surface the Wall A veneer revision applies to.',
    provenance: {
      origin: 'Villa 253 approved render set (Concept A)',
      licence: 'Project asset - approved by the client',
      method: 'Detail view of the master bed wall'
    }
  },
  {
    id: 'MED-V253-06',
    title: 'Bedroom 2 - guest suite with the bar deck',
    kind: 'RENDER',
    url: VILLA253_ASSETS.guestSuite,
    roomRef: 'ROOM-V253-BED2-01',
    roomTypes: ['BEDROOM'],
    elementHint: 'RENDER_3D',
    description: 'Approved Bedroom 2 view: 18\'-11" x 19\'-0" with the wardrobe run and access to the 14\' x 30\'10" bar deck.',
    provenance: {
      origin: 'Villa 253 approved render set (Concept A)',
      licence: 'Project asset - approved by the client',
      method: 'Approved concept render for Bedroom 2'
    }
  },
  {
    id: 'MED-V253-07',
    title: 'Roof Gazebo - teak pergola over the 24\' x 18\' pavilion',
    kind: 'RENDER',
    url: VILLA253_ASSETS.gazebo,
    roomRef: 'ROOM-V253-GAZEBO-01',
    roomTypes: ['GAZEBO'],
    elementHint: 'RENDER_3D',
    description: 'Approved gazebo view: pitched Burma teak pergola to Section BB\', ridge 12\'-9" above the first-floor slab.',
    provenance: {
      origin: 'Villa 253 approved render set (Concept A)',
      licence: 'Project asset - approved by the client',
      method: 'Approved concept render for the roof gazebo'
    }
  },
  {
    id: 'MED-V253-08',
    title: 'Roof Gazebo - terrace and outdoor bar',
    kind: 'RENDER',
    url: VILLA253_ASSETS.gazeboTerrace,
    roomRef: 'ROOM-V253-GAZEBO-01',
    roomTypes: ['GAZEBO'],
    elementHint: 'REFERENCE_IMAGE',
    description: 'Terrace side of the gazebo: bar counter, low seating cluster and the outdoor lighting points.',
    provenance: {
      origin: 'Villa 253 approved render set (Concept A)',
      licence: 'Project asset - approved by the client',
      method: 'Second approved view of the gazebo terrace'
    }
  },
  {
    id: 'MED-V253-09',
    title: 'Wall marking drawing R0 (construction authority)',
    kind: 'CAD_DRAWING',
    url: VILLA253_ASSETS.cadPdf,
    roomRef: 'PROJECT',
    roomTypes: [],
    elementHint: 'DIMENSION_SHEET',
    description: 'VILLA_253_WALL_MARKING_10_10_24_REV0.pdf - all seven spaces dimensioned, 1:100. The authority for every quantity.',
    provenance: {
      origin: 'Architect issued drawing, dated 10-10-24, revision R0',
      sourceUrl: '/api/cad/villa253.pdf',
      licence: 'Project document',
      method: 'Issued PDF, downloaded from the project CAD register'
    }
  },
  {
    id: 'MED-V253-10',
    title: 'Editable floor plan R0 (8-layer DXF)',
    kind: 'CAD_DRAWING',
    url: VILLA253_ASSETS.cadDxf,
    roomRef: 'PROJECT',
    roomTypes: [],
    elementHint: 'DIMENSION_SHEET',
    description: 'Villa253_FloorPlan_Editable_R0.dxf - layers A-WALL, A-DOOR, A-WIND, A-STRS, A-DECK, A-DIMS, A-TEXT, A-NOTE.',
    provenance: {
      origin: 'Working reconstruction of the R0 drawing',
      sourceUrl: '/api/cad/villa253.dxf',
      licence: 'Project document',
      method: 'Editable DXF generated from the R0 dimension set'
    }
  },
  {
    id: 'MED-V253-11',
    title: 'Floor plan vector preview (all spaces)',
    kind: 'PLAN_SHEET',
    url: VILLA253_ASSETS.cadBlueprint,
    roomRef: 'PROJECT',
    roomTypes: [],
    elementHint: 'DIMENSION_SHEET',
    description: 'Vector preview of the R0 plan with the seven spaces and the opening schedule.',
    provenance: {
      origin: 'Derived from the R0 DXF geometry',
      licence: 'Project asset',
      method: 'SVG rendered from the R0 CAD layers'
    }
  },
  {
    id: 'MED-V253-12',
    title: 'Bedroom 3 (first floor) 20\'-8" x 19\'-0" plan sheet',
    kind: 'PLAN_SHEET',
    url: VILLA253_ASSETS.bed3Plan,
    roomRef: 'ROOM-V253-BED3-01',
    roomTypes: ['BEDROOM'],
    elementHint: 'DIMENSION_SHEET',
    description: 'Dimensioned plan of Bedroom 3 with the front and side balconies and toilet 3.',
    provenance: {
      origin: 'Derived from the R0 DXF geometry',
      licence: 'Project asset',
      method: 'SVG plan sheet for the room'
    }
  },
  {
    id: 'MED-V253-13',
    title: 'Kitchen & utility 14\'-6" x 9\'-0" plan sheet',
    kind: 'PLAN_SHEET',
    url: VILLA253_ASSETS.kitchenPlan,
    roomRef: 'ROOM-V253-KIT-01',
    roomTypes: ['KITCHEN'],
    elementHint: 'DIMENSION_SHEET',
    description: 'Dimensioned kitchen plan with the utility 9\'0"x9\'8" and powder room 5\'0"x9\'8".',
    provenance: {
      origin: 'Derived from the R0 DXF geometry',
      licence: 'Project asset',
      method: 'SVG plan sheet for the room'
    }
  },
  {
    id: 'MED-V253-14',
    title: 'Staircase core 7\'-6" x 19\'-0" plan sheet',
    kind: 'PLAN_SHEET',
    url: VILLA253_ASSETS.stairPlan,
    roomRef: 'ROOM-V253-STAIR-01',
    roomTypes: ['STAIRCASE'],
    elementHint: 'DIMENSION_SHEET',
    description: 'Dogleg stair: 21 risers, 11" tread, 6.25" riser, 3\'-6" waist, W2/W2A glazing.',
    provenance: {
      origin: 'Derived from the R0 DXF geometry',
      licence: 'Project asset',
      method: 'SVG plan sheet for the room'
    }
  },
  {
    id: 'MED-V253-15',
    title: 'Site sketch - villa massing and orientation',
    kind: 'SKETCH',
    url: VILLA253_ASSETS.buildingSketch,
    roomRef: 'PROJECT',
    roomTypes: [],
    elementHint: 'REFERENCE_IMAGE',
    description: 'Hand sketch used during the 30-05-2026 site visit to confirm the north orientation and deck extents.',
    provenance: {
      origin: 'Site survey record',
      licence: 'Project asset',
      method: 'Sketched on site against the R0 print'
    }
  }
];

/** Media that shows a given floor plan room (by id or by room type). */
export function mediaForRoom(roomRef: string, roomType?: string): ProjectMediaItem[] {
  return VILLA253_MEDIA_LIBRARY.filter(item => {
    if (item.roomRef === roomRef) return true;
    if (roomType && item.roomTypes.includes(roomType)) return true;
    return false;
  });
}

/** The best available visual for a room - a project render, else a plan sheet. */
export function primaryVisualForRoom(roomRef: string, roomType?: string): ProjectMediaItem | undefined {
  const candidates = mediaForRoom(roomRef, roomType);
  return (
    candidates.find(m => m.elementHint === 'RENDER_3D') ||
    candidates.find(m => m.kind === 'PLAN_SHEET') ||
    candidates.find(m => m.kind === 'RENDER') ||
    candidates[0]
  );
}

/** Whole-villa drawings (plans, CAD files, site sketch). */
export function projectDrawings(): ProjectMediaItem[] {
  return VILLA253_MEDIA_LIBRARY.filter(m => m.roomRef === 'PROJECT');
}
