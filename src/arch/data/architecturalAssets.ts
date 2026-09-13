import { ArchitecturalVisualAsset, SampleInspirationData } from '../types';

export type { SampleInspirationData };

export const SAMPLE_CLIENT_INSPIRATIONS: SampleInspirationData[] = [
  {
    id: 'INSP-001',
    clientName: 'Vikram Malhotra',
    source: 'Client Pinterest Moodboard',
    title: 'Minimalist Monolithic Living & Dining',
    description: 'High-contrast travertine flooring paired with warm smoked oak fluted wall panelling and integrated linear light cove.',
    imageUrl: '/assets/images/minimalist_concept_render_1789216644600.jpg',
    tags: ['Minimalist', 'Smoked Oak', 'Travertine', 'Warm Neutral'],
    createdAt: '2026-02-10T10:00:00Z'
  },
  {
    id: 'INSP-002',
    clientName: 'Priya Malhotra',
    source: 'Architectural Digest India Feature',
    title: 'Biophilic Indoor Greenery & Atrium Daylighting',
    description: 'Integrated vertical planter wall, double-height ceiling voids, and natural clay-mineral breathable wall plasters.',
    imageUrl: '/assets/images/biophilic_concept_render_1789216627991.jpg',
    tags: ['Biophilic', 'Courtyard', 'Natural Light', 'Eco Plaster'],
    createdAt: '2026-02-12T14:30:00Z'
  },
  {
    id: 'INSP-003',
    clientName: 'Vikram Malhotra',
    source: 'Initial Site Survey Sketch',
    title: 'Hand-Sketched Spatial Flow & Balcony Deck Integration',
    description: 'Preliminary freehand study demonstrating partition removal between dining and balcony deck to maximize panoramic city views.',
    imageUrl: '/assets/images/house-sketch-reference.jpg',
    tags: ['Site Survey', 'Hand Sketch', 'Balcony Deck', 'Spatial Flow'],
    createdAt: '2026-02-14T09:15:00Z'
  },
  {
    id: 'INSP-004',
    clientName: 'Priya Malhotra',
    source: 'Material Library Selection',
    title: 'Curated Material Moodboard: Statuario & Brushed Brass',
    description: 'Physical material palette comprising honed Statuario marble, brushed antique brass accents, and Belgian linen upholstery.',
    imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
    tags: ['Materials', 'Statuario Marble', 'Brushed Brass', 'Linen'],
    createdAt: '2026-02-16T16:00:00Z'
  }
];

const STYLE_IMAGE_MAP: Record<string, string> = {
  biophilic: '/assets/images/biophilic_concept_render_1789216627991.jpg',
  minimalist: '/assets/images/minimalist_concept_render_1789216644600.jpg',
  industrial: '/assets/images/industrial_concept_render_1789216663974.jpg',
  neoclassic: '/assets/images/neoclassic_render_1789216684796.jpg',
  tropical: '/assets/images/tropical_eco_render_1789218073135.jpg',
  default: '/assets/images/minimalist_concept_render_1789216644600.jpg'
};

function getStyleKey(themeStyle?: string): string {
  if (!themeStyle) return 'minimalist';
  const lower = themeStyle.toLowerCase();
  if (lower.includes('biophilic') || lower.includes('green') || lower.includes('nature')) return 'biophilic';
  if (lower.includes('industrial') || lower.includes('loft') || lower.includes('concrete')) return 'industrial';
  if (lower.includes('neoclassic') || lower.includes('classic') || lower.includes('heritage')) return 'neoclassic';
  if (lower.includes('tropical') || lower.includes('eco') || lower.includes('resort')) return 'tropical';
  return 'minimalist';
}

export function getVisualAssetsForConcept(
  optionNumber: number = 1,
  themeStyle?: string,
  builtUpAreaSqFt: number = 3400
): ArchitecturalVisualAsset[] {
  const styleKey = getStyleKey(themeStyle);
  const primaryRender = STYLE_IMAGE_MAP[styleKey] || STYLE_IMAGE_MAP.default;

  return [
    {
      id: `asset-opt${optionNumber}-render`,
      type: 'render_3d',
      title: `3D Perspective Visualization - Option ${optionNumber}`,
      subtitle: `${themeStyle || 'Contemporary Minimalist'} Experience`,
      imageUrl: primaryRender,
      drawingNumber: `VIS-OPT-${optionNumber}-3D`,
      scale: 'N.T.S.',
      revision: 'Rev A',
      sheetSize: '16:9 4K',
      caption: `Photorealistic 3D visualization illustrating spatial volume, material finishes, and daylighting.`,
      isPrimary: true,
      tags: ['3D Perspective', 'Exterior/Interior', 'Materiality', 'Photorealistic'],
      approvalStatus: 'approved',
      sourceType: 'ai_synthesis',
      uploadedAt: new Date().toISOString()
    },
    {
      id: `asset-opt${optionNumber}-cad-plan`,
      type: 'cad_floor_plan',
      title: `Architectural CAD Floor Plan - Option ${optionNumber}`,
      subtitle: `${builtUpAreaSqFt.toLocaleString()} sq.ft Measured Spatial Zoning`,
      imageUrl: '/assets/images/cad_floor_plan_1789216705163.jpg',
      drawingNumber: `ARC-OPT-${optionNumber}-PL-01`,
      scale: '1:50 @ A1',
      revision: 'Rev B',
      sheetSize: 'A1 Metric (841 x 594 mm)',
      caption: `Dimensioned architectural floor plan showing spatial circulation, furniture layout, and room zoning.`,
      isPrimary: false,
      tags: ['CAD', 'Floor Plan', 'Zoning', 'Dimensioned'],
      approvalStatus: 'approved',
      sourceType: 'architect_cad',
      uploadedAt: new Date().toISOString()
    },
    {
      id: `asset-opt${optionNumber}-cad-section`,
      type: 'elevation_section',
      title: `Longitudinal Section & Elevation - Option ${optionNumber}`,
      subtitle: 'Clear Ceilings, Void Relationships & MEP False Ceiling Clearances',
      imageUrl: '/assets/images/cad_section_drawing_1789218091254.jpg',
      drawingNumber: `ARC-OPT-${optionNumber}-SEC-01`,
      scale: '1:50 @ A1',
      revision: 'Rev A',
      sheetSize: 'A1 Metric (841 x 594 mm)',
      caption: `Architectural section detailing clear floor-to-ceiling heights, false ceiling coves, and window lintels.`,
      isPrimary: false,
      tags: ['Section', 'Elevation', 'Ceiling Height', 'MEP Integration'],
      approvalStatus: 'approved',
      sourceType: 'architect_cad',
      uploadedAt: new Date().toISOString()
    },
    {
      id: `asset-opt${optionNumber}-moodboard`,
      type: 'material_moodboard',
      title: `Curated Material & Finishes Moodboard - Option ${optionNumber}`,
      subtitle: 'Statuario Marble, Smoked Oak Veneer, Natural Plaster & Architectural Brass',
      imageUrl: '/assets/images/materials_moodboard_1789218106559.jpg',
      drawingNumber: `MAT-OPT-${optionNumber}-MB-01`,
      scale: 'Physical Swatch Spec',
      revision: 'Rev A',
      sheetSize: 'A2 Spec Sheet',
      caption: `Physical tactile palette curated specifically for Option ${optionNumber}.`,
      isPrimary: false,
      tags: ['Materials', 'Moodboard', 'Veneers', 'Marble', 'Hardware'],
      approvalStatus: 'approved',
      sourceType: 'sample_data',
      uploadedAt: new Date().toISOString()
    },
    {
      id: `asset-opt${optionNumber}-client-ref`,
      type: 'client_reference',
      title: `Client Hand Sketch & Inspiration Study`,
      subtitle: 'Original Site Survey Constraints & Brief Inputs',
      imageUrl: '/assets/images/house-sketch-reference.jpg',
      drawingNumber: `REF-BRIEF-${optionNumber}`,
      scale: 'Field Survey Sketch',
      revision: 'Rev 0',
      sheetSize: 'A4 Field Pad',
      caption: `Site survey brief sketch confirming partition demolition and terrace deck integration.`,
      isPrimary: false,
      tags: ['Client Brief', 'Hand Sketch', 'Site Survey'],
      approvalStatus: 'approved',
      sourceType: 'client_upload',
      uploadedAt: new Date().toISOString()
    }
  ];
}
