/**
 * Build Storys ERP - VILLA 253 AI DESIGN STUDIO SESSION (demo seed)
 * ----------------------------------------------------------------
 * A fully worked example of the AI Design Studio for PROJ-VILLA-253:
 * the R0 wall-marking drawing was read as CAD geometry, the Kulkarnis
 * filled the preference form, four concepts were generated from the SAME
 * floor plan, Concept A was revised once and approved, and a room-wise
 * BOQ draft was generated from the approved concept.
 *
 * Everything here is produced by the engine - nothing is hand-typed - so the
 * demo always shows numbers that reconcile with the room model.
 */

import { DEFAULT_MASTER_RATES } from '../server/mockMasters';
import {
  applyConceptRevision,
  buildFloorPlanModel,
  generateBOQFromConcept,
  generateConcepts,
  logPrompt,
  newSession,
  RawRoomInput
} from '../server/designStudioEngine';
import { DesignStudioSession } from '../types/designStudio';
import { VILLA253, VILLA253_ROOMS } from './villa253DemoProject';

const OPENINGS: Record<string, RawRoomInput['openings']> = {
  'ROOM-V253-LIV-01': [
    { code: 'SD1', type: 'SLIDER', widthFt: 27, heightFt: 10.25, wall: 'NORTH', note: "27'-0\" x 10'-3\" great-room portal" },
    { code: 'SD5', type: 'SLIDER', widthFt: 11, heightFt: 10.25, wall: 'NORTH' },
    { code: 'W1', type: 'WINDOW', widthFt: 6, heightFt: 4, wall: 'EAST' },
    { code: 'FW1', type: 'FRENCH_WINDOW', widthFt: 8, heightFt: 8, wall: 'WEST' }
  ],
  'ROOM-V253-BED1-01': [
    { code: 'SD2', type: 'SLIDER', widthFt: 12, heightFt: 10.25, wall: 'WEST' },
    { code: 'SD4', type: 'SLIDER', widthFt: 10, heightFt: 10.25, wall: 'SOUTH' },
    { code: 'SD7', type: 'SLIDER', widthFt: 7, heightFt: 10.25, wall: 'WEST' },
    { code: 'D1', type: 'DOOR', widthFt: 3, heightFt: 7, wall: 'NORTH' },
    { code: 'D2', type: 'DOOR', widthFt: 2.75, heightFt: 7, wall: 'NORTH', note: 'Toilet 1' }
  ],
  'ROOM-V253-BED2-01': [
    { code: 'SD2', type: 'SLIDER', widthFt: 12, heightFt: 10.25, wall: 'NORTH' },
    { code: 'SD6', type: 'SLIDER', widthFt: 9, heightFt: 10.25, wall: 'EAST' },
    { code: 'D1', type: 'DOOR', widthFt: 3, heightFt: 7, wall: 'SOUTH' },
    { code: 'D3', type: 'DOOR', widthFt: 2.75, heightFt: 7, wall: 'SOUTH', note: 'Toilet 2' },
    { code: 'W5', type: 'WINDOW', widthFt: 4, heightFt: 4, wall: 'EAST' },
    { code: 'FW2', type: 'FRENCH_WINDOW', widthFt: 8, heightFt: 8, wall: 'EAST' }
  ],
  'ROOM-V253-KIT-01': [
    { code: 'D4', type: 'DOOR', widthFt: 3, heightFt: 7.67, wall: 'SOUTH' },
    { code: 'W3', type: 'WINDOW', widthFt: 5, heightFt: 4, wall: 'EAST' },
    { code: 'W4', type: 'WINDOW', widthFt: 4, heightFt: 4, wall: 'NORTH' }
  ],
  'ROOM-V253-STAIR-01': [
    { code: 'W2', type: 'WINDOW', widthFt: 3.5, heightFt: 8, wall: 'SOUTH' },
    { code: 'W2A', type: 'WINDOW', widthFt: 3.5, heightFt: 8, wall: 'SOUTH' },
    { code: 'SD3', type: 'SLIDER', widthFt: 5, heightFt: 8, wall: 'EAST' },
    { code: 'SD4A', type: 'SLIDER', widthFt: 5, heightFt: 8, wall: 'WEST' }
  ],
  'ROOM-V253-BED3-01': [
    { code: 'SD1A', type: 'SLIDER', widthFt: 12, heightFt: 10.25, wall: 'WEST' },
    { code: 'SD2A', type: 'SLIDER', widthFt: 10, heightFt: 10.25, wall: 'WEST' },
    { code: 'SD3A', type: 'SLIDER', widthFt: 8, heightFt: 10.25, wall: 'SOUTH' },
    { code: 'D1A', type: 'DOOR', widthFt: 3, heightFt: 7, wall: 'NORTH' },
    { code: 'D2A', type: 'DOOR', widthFt: 2.75, heightFt: 7, wall: 'NORTH', note: 'Toilet 3' },
    { code: 'W3A', type: 'WINDOW', widthFt: 4, heightFt: 4, wall: 'EAST' }
  ],
  'ROOM-V253-GAZEBO-01': [
    { code: 'SD4A', type: 'SLIDER', widthFt: 5, heightFt: 8, wall: 'SOUTH', note: 'Access from first-floor terrace' }
  ]
};

function buildVilla253StudioSession(): DesignStudioSession {
  const rawRooms: RawRoomInput[] = VILLA253_ROOMS.map(room => ({
    id: room.id,
    name: room.name,
    floor: room.floor,
    lengthFt: room.lengthFt,
    widthFt: room.widthFt,
    ceilingHeightFt: room.heightFt,
    openings: OPENINGS[room.id] || [],
    notes: room.notes,
    confidence: 'CAD_EXTRACTED'
  }));

  const model = buildFloorPlanModel({
    kind: 'DXF',
    fileName: 'Villa253_FloorPlan_Editable_R0.dxf',
    sizeKb: 640,
    uploadedBy: 'Ar. Shruthi (Design Director)',
    uploadedAt: '2026-05-20T11:12:00Z',
    previewUrl: '/assets/images/villa253_cad_blueprint_r0.svg',
    cadDownloadUrl: '/api/cad/villa253.dxf',
    scaleRatio: '1:100',
    rooms: rawRooms,
    columnsDetected: 18,
    analysisNotes: [
      '8 CAD layers read: A-WALL, A-DOOR, A-WIND, A-STRS, A-DECK, A-DIMS, A-TEXT, A-NOTE.',
      'Seven spaces identified and matched to the R0 wall-marking sheet dated 10-10-24.',
      'Opening schedule SD1-SD7, SD1A-SD3A, D1-D4, W1-W5, FW1-FW2 mapped to their host rooms.'
    ]
  });
  model.confirmedAt = '2026-05-30T18:45:00Z';
  model.confirmedBy = 'Ar. Rajesh Sharma (site re-measurement, all rooms within 12mm)';

  let session: DesignStudioSession = {
    ...newSession(VILLA253.projectId),
    stage: 'PREFERENCES',
    model,
    createdAt: '2026-05-20T11:12:00Z',
    updatedAt: '2026-11-08T16:30:00Z'
  };

  session = logPrompt(
    session,
    'Ar. Shruthi (Design Director)',
    'FLOOR_PLAN_ANALYSED',
    'Read floor plan Villa253_FloorPlan_Editable_R0.dxf - identify rooms, walls, openings, staircase and decks.',
    `${model.rooms.length} rooms, ${model.doorsDetected} doors, ${model.windowsDetected} windows/sliders, ${model.columnsDetected} columns, ${model.totalCarpetSqFt} sq.ft carpet. ${model.uncertainItems.length} items flagged.`
  );

  session = {
    ...session,
    preferences: {
      propertyType: 'VILLA',
      carpetAreaSqFt: model.totalCarpetSqFt,
      style: 'LUXURY',
      budgetBand: 'PREMIUM',
      palette: 'WARM',
      flooring: 'MARBLE',
      furniture: 'CUSTOM',
      kitchenLayout: 'L_SHAPED',
      lighting: ['AMBIENT', 'ACCENT'],
      storage: 'MAXIMUM',
      specialRequirements: ['VASTU', 'CHILDREN'],
      roomInstructions: [
        { roomId: 'ROOM-V253-LIV-01', roomName: 'Living & Dining Great Room', instruction: 'Luxury modern, beige and walnut. Keep the 27ft SD1 portal completely unobstructed.' },
        { roomId: 'ROOM-V253-BED1-01', roomName: 'Master Bedroom 1 Suite', instruction: 'Contemporary with a walk-in wardrobe; bed head on the south-west wall as per Vastu.' },
        { roomId: 'ROOM-V253-KIT-01', roomName: 'Culinary Kitchen, Utility & Powder Wing', instruction: 'Modular, matte finish, maximum storage. Tall unit for the oven tower.' },
        { roomId: 'ROOM-V253-BED3-01', roomName: 'Bedroom 3 & Balcony Suite', instruction: 'Kids room - playful but not childish, space-saving furniture, study nook near the balcony.' },
        { roomId: 'ROOM-V253-GAZEBO-01', roomName: 'Signature Roof Gazebo Pavilion', instruction: 'Family evening space - teak pergola, outdoor bar and a low seating cluster.' }
      ],
      additionalNotes:
        'Handover before the December school break. No structural changes. Terrace slab cracks to be treated before the gazebo base plates are loaded.',
      updatedAt: '2026-06-06T16:20:00Z',
      updatedBy: 'Rahul Deshmukh (with Mrs. Sneha Kulkarni)'
    }
  };

  session = logPrompt(
    session,
    'Rahul Deshmukh (Sales)',
    'PREFERENCES_CAPTURED',
    'Villa, 2205 sq.ft carpet, luxury style, premium budget, warm palette, marble flooring, custom furniture, L-shaped kitchen, ambient + accent lighting, maximum storage, Vastu and children requirements. Room-wise instructions for living, master, kitchen, bedroom 3 and gazebo.',
    'Structured preference record created - used as hard constraints for concept generation.'
  );

  const concepts = generateConcepts(VILLA253.projectId, model, session.preferences!, 4);

  // Client picked Concept A (Modern Luxury), asked for one colour revision.
  const revised = applyConceptRevision(
    concepts[0],
    {
      id: 'REV-V253-DS-01',
      requestedAt: '2026-06-24T15:10:00Z',
      requestedBy: 'Sneha Kulkarni (client)',
      scope: 'ROOM',
      roomId: 'ROOM-V253-LIV-01',
      changeType: 'COLOUR_ONLY',
      instruction: 'Warmer beige on the great-room walls; keep the walnut joinery and all furniture exactly as shown.'
    },
    'Meera Rao'
  );

  const approved = {
    ...revised,
    status: 'APPROVED' as const,
    selectedAt: '2026-06-26T11:00:00Z',
    approvedAt: '2026-06-27T12:20:00Z',
    approvedBy: 'Aditya & Sneha Kulkarni',
    clientRating: 5,
    roomSchemes: revised.roomSchemes.map(room => ({ ...room, locked: true }))
  };

  const conceptList = [
    approved,
    ...concepts.slice(1).map(c => ({ ...c, status: 'PRESENTED' as const }))
  ];

  session = {
    ...session,
    stage: 'CUSTOMER_REVIEW',
    concepts: conceptList,
    selectedConceptId: approved.id
  };

  session = logPrompt(
    session,
    'AI Design Studio Engine',
    'CONCEPTS_GENERATED',
    `Generate 4 concepts for ${model.rooms.length} rooms: luxury (requested), minimalist, scandinavian, contemporary. Constraints: premium budget, warm palette, marble, maximum storage, Vastu, children.`,
    `${conceptList.length} concepts generated room-wise; Concept A revised once (colour only on the great room) and approved by the client.`
  );

  session = {
    ...session,
    stage: 'APPROVED',
    approvedConceptId: approved.id
  };

  const revisionId = 'REV-V253-CONCEPT-APPROVED';
  const boq = generateBOQFromConcept(
    session,
    approved,
    DEFAULT_MASTER_RATES,
    revisionId,
    'Rev 0 - AI Design Studio Concept Takeoff'
  );

  session = {
    ...session,
    stage: 'BOQ_GENERATED',
    boqDraft: {
      revisionId,
      revisionLabel: 'Rev 0 - AI Design Studio Concept Takeoff',
      items: boq.items,
      subtotalSelling: boq.subtotalSelling,
      generatedAt: '2026-06-19T09:30:00Z',
      generatedFromConceptId: approved.id
    }
  };

  session = logPrompt(
    session,
    'Rajesh Sharma (Lead QS)',
    'BOQ_GENERATED',
    'Convert approved Concept A into a room-wise BOQ using the measured R0 model and the Master Schedule of Rates.',
    `${boq.items.length} BOQ lines across ${model.rooms.length} rooms; subtotal ₹${boq.subtotalSelling.toLocaleString('en-IN')} before GST.`
  );

  return session;
}

export const VILLA253_DESIGN_STUDIO_SESSION: DesignStudioSession = buildVilla253StudioSession();
