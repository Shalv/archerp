/**
 * Build Storys ERP - VILLA 253 PROJECT DESIGN DIGITAL TWIN (demo seed)
 * ===================================================================
 * The twin is BUILT, not written: it comes from the approved studio concept
 * (Concept A, Modern Luxury v2), the confirmed R0 floor plan model and the
 * BOQ revision - so every room, element, material and asset traces back to
 * something the client actually approved.
 *
 * The seed then replays one real client change on Master Bedroom Wall A
 * (Asian Paints emulsion -> American Walnut veneer -> Natural Oak veneer),
 * approves the regenerated assets, re-issues the package and releases it.
 * The result is a published package with a genuine revision history, ready to
 * be challenged live in the demo.
 */

import { DEFAULT_MASTER_RATES } from '../server/mockMasters';
import {
  applyElementChange,
  approveElementRevision,
  approvePackage,
  attachAsset,
  buildDesignTwin,
  reissuePackage,
  validateDesignPackage
} from '../server/designTwinEngine';
import { DesignTwin, MaterialSpecRecord } from '../types/designTwin';
import { VILLA253_DESIGN_STUDIO_SESSION } from './villa253DesignStudio';
import { VILLA253, VILLA253_BOQ_REV1 } from './villa253DemoProject';

/** Approved finish templates the studio can switch an element to. */
export const VILLA253_FINISH_LIBRARY: MaterialSpecRecord[] = [
  {
    id: 'MAT-LIB-WAL-01',
    projectId: VILLA253.projectId,
    name: 'American Walnut Veneer',
    category: 'Feature wall veneer',
    specification: '0.6mm American walnut crown-cut veneer on 12mm BWP backing, PU matt',
    brand: 'Bord Products / CenturyPly',
    finish: 'PU matt, low sheen',
    unit: 'sq.ft',
    trade: 'CARPENTRY_JOINERY',
    rate: 990,
    approved: true,
    approvedBy: 'Sneha Kulkarni (client)',
    approvedAt: '2026-09-12T11:20:00Z',
    supplierRef: 'Approved sample board SB-04',
    boqQuantity: 0,
    boqItemCodes: [],
    colourHex: '#5a4634',
    notes: 'Client-approved veneer sample, crown cut, batch matched to the walk-in wardrobe.'
  },
  {
    id: 'MAT-LIB-OAK-01',
    projectId: VILLA253.projectId,
    name: 'Natural Oak Veneer',
    category: 'Feature wall veneer',
    specification: '0.6mm natural white oak veneer on 12mm BWP backing, PU matt',
    brand: 'Bord Products / CenturyPly',
    finish: 'PU matt, natural grain',
    unit: 'sq.ft',
    trade: 'CARPENTRY_JOINERY',
    rate: 845,
    approved: true,
    approvedBy: 'Sneha Kulkarni (client)',
    approvedAt: '2026-10-28T16:05:00Z',
    supplierRef: 'Approved sample board SB-11',
    boqQuantity: 0,
    boqItemCodes: [],
    colourHex: '#c9a87c',
    notes: 'Approved as the lighter alternative to walnut after the 24-10-2026 sample review.'
  },
  {
    id: 'MAT-LIB-MCR-01',
    projectId: VILLA253.projectId,
    name: 'Micro-Cement Wall Finish',
    category: 'Feature wall finish',
    specification: '2mm micro-cement on primed plaster, sealed matt',
    brand: 'Ideal Work / local applicator',
    finish: 'Sealed matt',
    unit: 'sq.ft',
    trade: 'PAINTING_POLISHING',
    rate: 320,
    approved: true,
    approvedBy: 'Sneha Kulkarni (client)',
    approvedAt: '2026-10-28T16:10:00Z',
    boqQuantity: 0,
    boqItemCodes: [],
    colourHex: '#cfc9c0',
    notes: 'Approved for accent walls only; not for wet areas.'
  }
];

function buildSeededTwin(): DesignTwin {
  const session = VILLA253_DESIGN_STUDIO_SESSION;
  const model = session.model;
  const concept = session.concepts.find(c => c.id === session.approvedConceptId) || session.concepts[0];
  if (!model || !concept) throw new Error('The design twin seed needs a confirmed floor plan and an approved concept.');

  let twin = buildDesignTwin({
    projectId: VILLA253.projectId,
    model,
    concept,
    boqItems: VILLA253_BOQ_REV1,
    boqRevisionId: 'REV-V253-1-ESTIMATOR-APPROVED',
    actor: 'Ar. Shruthi (Design Director)',
    requirements: [
      { id: 'REQ-V253-001', text: 'Master Bedroom 1 Suite: contemporary with a walk-in wardrobe; bed head on the south-west wall as per Vastu.' },
      { id: 'REQ-V253-002', text: 'Living & Dining Great Room: luxury modern, beige and walnut, keep the SD1 portal clear.' },
      { id: 'REQ-V253-003', text: 'Culinary Kitchen: modular, matte finish, maximum storage.' },
      { id: 'REQ-V253-004', text: 'Bedroom 3 & Balcony Suite: kids room, space-saving furniture, study nook.' },
      { id: 'REQ-V253-005', text: 'Signature Roof Gazebo Pavilion: family evening space, teak pergola, outdoor bar.' }
    ]
  });

  // finish templates live in the project library from the start
  twin.materials = [...twin.materials, ...VILLA253_FINISH_LIBRARY.map(m => ({ ...m }))];

  const master = twin.rooms.find(r => r.roomType === 'MASTER_BEDROOM');
  const wallA = master?.elements.find(el => el.kind === 'WALL_A');
  if (!master || !wallA) return twin;

  // ---- change 1: emulsion -> American Walnut veneer feature wall
  const first = applyElementChange(twin, {
    elementId: wallA.id,
    field: 'MATERIAL',
    toMaterialId: 'MAT-LIB-WAL-01',
    reason: 'Client asked for a walnut veneer feature wall behind the bed (sample SB-04)',
    actor: 'Meera Rao (Lead Interior Designer)'
  });
  twin = first.twin;

  // ---- change 2: walnut -> natural oak (the lighter sample the client preferred)
  const second = applyElementChange(twin, {
    elementId: wallA.id,
    field: 'MATERIAL',
    toMaterialId: 'MAT-LIB-OAK-01',
    reason: 'Client reviewed SB-11 and asked to change Wall A from walnut to natural oak',
    actor: 'Meera Rao (Lead Interior Designer)'
  });
  twin = second.twin;

  // the client approves the regenerated elevation, mood board, detail and render
  twin = approveElementRevision(twin, wallA.id, 'Sneha Kulkarni (client)');

  // one manufacturer asset, attached with full provenance, to show the upload path
  const attached = attachAsset(twin, {
    elementId: wallA.id,
    assetType: 'MATERIAL_REFERENCE',
    url: '/images/villa253_master_suite_1790833696550.jpg',
    source: 'MANUFACTURER',
    materialRefs: [wallA.spec.materialRefs[0]],
    drawingRef: 'MR-MBR-WA-OAK',
    approvalStatus: 'APPROVED',
    provenance: {
      origin: 'Bord Products sample library',
      sourceUrl: 'https://example.invalid/bord/natural-oak-crown-cut',
      licence: 'Manufacturer marketing image, used with permission for this project',
      method: 'Manufacturer photograph of the approved crown-cut oak veneer'
    },
    actor: 'Meera Rao (Lead Interior Designer)',
    notes: 'Cross-check image from the veneer supplier; same batch as sample board SB-11.'
  });
  twin = attached.twin;

  // re-issue the whole set so every document carries one revision, then release
  twin = reissuePackage(twin, 'Rajesh Sharma (Lead Quantity Surveyor)');
  twin.validation = validateDesignPackage(twin, 'Rajesh Sharma (Lead Quantity Surveyor)');
  if (twin.validation.passed) {
    twin = approvePackage(twin, 'Ar. Shruthi (Design Director)');
  }
  twin.updatedAt = new Date().toISOString();
  return twin;
}

export const VILLA253_DESIGN_TWIN: DesignTwin = buildSeededTwin();

/** Master rates are exported so the UI can price a custom material change. */
export const VILLA253_TWIN_MASTER_RATES = DEFAULT_MASTER_RATES;
