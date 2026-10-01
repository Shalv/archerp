import fs from 'fs';
import path from 'path';
import { GoogleGenAI } from '@google/genai';
import {
  VILLA_253_AUTHORITATIVE_SPECS,
  Villa253RoomSpec,
  buildRoomSpecificFilename
} from '../utils/villa253CadDataAndDxf';
import { resolveCanonicalVilla253RoomId } from '../data/villa253ReferenceImages';

export interface InteriorRenderRequest {
  roomId?: string;
  roomName: string;
  roomDimensions: string;
  layoutTitle: string;
  styleTheme: string;
  wallColorHex?: string;
  woodFinish?: string;
  flooringSpec?: string;
  ceilingSpec?: string;
  lightingSpec?: string;
  cctKelvin?: number;
  customPromptNotes?: string;
}

export interface InteriorRenderResult {
  imageUrl: string;
  fileName: string;
  providerUsed: 'OLLAMA_LOCAL' | 'GEMINI_IMAGEN' | 'GEMINI_FLASH_IMAGE' | 'CALIBRATED_VILLA253_ASSET';
  promptUsed: string;
  roomSpecUsed?: Villa253RoomSpec;
  generatedAt: string;
}

/**
 * Resolves the authoritative Villa 253 R0 room specification from roomId or roomName
 * so every interior render is anchored to the exact source floor plan + room dimensions.
 */
export function resolveVilla253RoomSpecForRender(
  roomId?: string,
  roomName?: string
): Villa253RoomSpec {
  const canonicalId = resolveCanonicalVilla253RoomId(roomId || roomName, roomName);
  return (
    VILLA_253_AUTHORITATIVE_SPECS[canonicalId] ||
    VILLA_253_AUTHORITATIVE_SPECS['ROOM-V253-LIV-01']
  );
}

/**
 * Builds an architectural prompt strictly grounded in the Villa 253 Wall Marking Drawing R0 (10-10-24)
 * source floor plan and exact room dimensions.
 */
export function buildArchitecturalRenderPrompt(req: InteriorRenderRequest): string {
  const spec = resolveVilla253RoomSpecForRender(req.roomId, req.roomName);

  const exactDims = `${spec.dimensionText} (${spec.lengthFt}ft × ${spec.widthFt}ft, ${spec.areaSqFt} sq.ft, clear height ${spec.heightFt}ft)`;
  const openingsContext = spec.doorWindowMarks.join(', ');
  const adjunctContext = spec.adjunctSpaces.join('; ');

  const parts = [
    `Photorealistic 8k architectural interior photography of ${spec.name} in Villa 253 (North-Facing, 24 Type – 3 Bedroom with Roof Gazebo, Wall Marking Drawing R0 dated 10-10-24).`,
    `Exact Verified Room Dimensions from Source Floor Plan: ${exactDims} on ${spec.floor} FLOOR.`,
    `Source Floor Plan Door & Window Schedule Marks in this room: ${openingsContext}.`,
    `Connected Adjunct Spaces & Decks from Villa 253 Plan: ${adjunctContext}.`,
    `Spatial Furniture Layout: ${req.layoutTitle}.`,
    `Interior Design Theme: ${req.styleTheme}.`,
    req.flooringSpec ? `Flooring Material: ${req.flooringSpec}.` : '',
    req.ceilingSpec ? `Ceiling & Rafters: ${req.ceilingSpec}.` : '',
    req.woodFinish ? `Joinery & Woodwork Finish: ${req.woodFinish}.` : '',
    req.wallColorHex ? `Primary Wall Tone: ${req.wallColorHex}.` : '',
    req.lightingSpec
      ? `Architectural Lighting: ${req.lightingSpec} (${req.cctKelvin || 2700}K color temperature).`
      : 'Warm 2700K concealed architectural LED cove lighting and natural daylight through Villa 253 North-facing glazing.',
    req.customPromptNotes ? `Additional Client Directives: ${req.customPromptNotes}.` : '',
    `Shot on Hasselblad H6D-100c, 24mm tilt-shift architectural lens, eye-level perspective true to the ${spec.dimensionText} room proportions, ultra-detailed textures, Architectural Digest quality.`
  ];

  return parts.filter(Boolean).join(' ');
}

/**
 * Saves a generated base64 image using a deterministic, room-specific filename
 * (e.g., villa253_room_v253_bed1_01_14x19ft_modern_warm_luxury.jpg) rather than a random number.
 */
function saveBase64ImageToPublic(
  base64Data: string,
  roomIdOrName: string,
  styleTheme?: string
): { imageUrl: string; fileName: string } {
  const cleanBase64 = base64Data.replace(/^data:image\/\w+;base64,/, '');
  const buffer = Buffer.from(cleanBase64, 'base64');
  const fileName = buildRoomSpecificFilename(roomIdOrName, styleTheme, 'jpg');

  const dir1 = path.join(process.cwd(), 'public', 'assets', 'images');
  const dir2 = path.join(process.cwd(), 'public', 'images');

  if (!fs.existsSync(dir1)) fs.mkdirSync(dir1, { recursive: true });
  if (!fs.existsSync(dir2)) fs.mkdirSync(dir2, { recursive: true });

  fs.writeFileSync(path.join(dir1, fileName), buffer);
  fs.writeFileSync(path.join(dir2, fileName), buffer);

  return {
    imageUrl: `/assets/images/${fileName}`,
    fileName
  };
}

/**
 * Room-specific fallback selector that strictly maps each Villa 253 room to its own dedicated visual.
 * Never returns a living-room image for a bedroom, kitchen, staircase, or roof gazebo.
 */
export function getRoomSpecificVilla253Asset(
  roomId?: string,
  roomName?: string,
  styleTheme?: string
): { imageUrl: string; fileName: string } {
  const canonicalId = resolveCanonicalVilla253RoomId(roomId || roomName, roomName);
  const theme = (styleTheme || '').toLowerCase();

  switch (canonicalId) {
    case 'ROOM-V253-BED1-01': {
      const useAlt = theme.includes('vastu') || theme.includes('evening') || theme.includes('contemporary');
      const img = useAlt
        ? '/assets/images/villa253_master_bedroom_1790830829821.jpg'
        : '/assets/images/villa253_master_suite_1790833696550.jpg';
      return {
        imageUrl: img,
        fileName: buildRoomSpecificFilename('bedroom1_master_14x19ft', styleTheme, 'jpg')
      };
    }
    case 'ROOM-V253-BED2-01':
      return {
        imageUrl: '/assets/images/villa253_guest_suite_1790833711200.jpg',
        fileName: buildRoomSpecificFilename('bedroom2_suite_18x19ft', styleTheme, 'jpg')
      };
    case 'ROOM-V253-BED3-01':
      return {
        imageUrl: '/assets/images/villa253_bedroom3_firstfloor_20x19_r0.svg',
        fileName: buildRoomSpecificFilename('bedroom3_firstfloor_20x19ft', styleTheme, 'svg')
      };
    case 'ROOM-V253-KIT-01':
      return {
        imageUrl: '/assets/images/villa253_kitchen_utility_14x9_r0.svg',
        fileName: buildRoomSpecificFilename('kitchen_utility_14x9ft', styleTheme, 'svg')
      };
    case 'ROOM-V253-STAIR-01':
      return {
        imageUrl: '/assets/images/villa253_staircase_core_7x19_r0.svg',
        fileName: buildRoomSpecificFilename('staircase_core_7x19ft', styleTheme, 'svg')
      };
    case 'ROOM-V253-GAZEBO-01': {
      const useDusk = theme.includes('sunset') || theme.includes('bar') || theme.includes('dusk');
      const img = useDusk
        ? '/assets/images/villa253_roof_gazebo_1790830815235.jpg'
        : '/assets/images/villa253_gazebo_terrace_1790833723445.jpg';
      return {
        imageUrl: img,
        fileName: buildRoomSpecificFilename('roof_gazebo_24x18ft', styleTheme, 'jpg')
      };
    }
    case 'EXTERIOR-FACADE':
      return {
        imageUrl: '/assets/images/villa253_facade_exterior_1790833735467.jpg',
        fileName: buildRoomSpecificFilename('north_facade_85x20ft', styleTheme, 'jpg')
      };
    case 'ROOM-V253-LIV-01':
    default: {
      const useModern = theme.includes('minimal') || theme.includes('vastu') || theme.includes('modern');
      const img = useModern
        ? '/assets/images/villa253_living_modern_1790830799942.jpg'
        : '/assets/images/villa253_living_greatroom_1790833681710.jpg';
      return {
        imageUrl: img,
        fileName: buildRoomSpecificFilename('living_dining_25x19ft', styleTheme, 'jpg')
      };
    }
  }
}

export async function generateInteriorConceptRender(
  req: InteriorRenderRequest
): Promise<InteriorRenderResult> {
  const roomSpec = resolveVilla253RoomSpecForRender(req.roomId, req.roomName);
  const prompt = buildArchitecturalRenderPrompt(req);
  const roomSlugKey = roomSpec.roomId || req.roomName;

  // 1. Try Local Ollama Image Generation if configured
  const ollamaUrl = process.env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434';
  const ollamaImageModel = process.env.OLLAMA_IMAGE_MODEL;

  if (ollamaImageModel) {
    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 15000);
      const res = await fetch(`${ollamaUrl}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: ollamaImageModel,
          prompt,
          stream: false
        }),
        signal: controller.signal
      });
      clearTimeout(timeout);

      if (res.ok) {
        const data = (await res.json()) as { images?: string[]; response?: string };
        if (data.images && data.images.length > 0) {
          const saved = saveBase64ImageToPublic(data.images[0], roomSlugKey, req.styleTheme);
          return {
            imageUrl: saved.imageUrl,
            fileName: saved.fileName,
            providerUsed: 'OLLAMA_LOCAL',
            promptUsed: prompt,
            roomSpecUsed: roomSpec,
            generatedAt: new Date().toISOString()
          };
        }
      }
    } catch {
      // Proceed to Gemini API or calibrated room-specific asset
    }
  }

  // 2. Try Gemini Image Generation if GEMINI_API_KEY is available
  const apiKey = process.env.GEMINI_API_KEY;
  if (apiKey && apiKey.trim() !== '' && apiKey !== 'YOUR_GEMINI_API_KEY') {
    const ai = new GoogleGenAI({ apiKey });

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }]
        },
        config: {
          imageConfig: {
            aspectRatio: '16:9'
          }
        }
      });

      const candidates = response.candidates || [];
      for (const candidate of candidates) {
        const parts = candidate.content?.parts || [];
        for (const part of parts) {
          if (part.inlineData && part.inlineData.data) {
            const saved = saveBase64ImageToPublic(
              part.inlineData.data,
              roomSlugKey,
              req.styleTheme
            );
            return {
              imageUrl: saved.imageUrl,
              fileName: saved.fileName,
              providerUsed: 'GEMINI_FLASH_IMAGE',
              promptUsed: prompt,
              roomSpecUsed: roomSpec,
              generatedAt: new Date().toISOString()
            };
          }
        }
      }
    } catch {
      try {
        const imgResp = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt,
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg',
            aspectRatio: '16:9'
          }
        });
        const b64 = imgResp.generatedImages?.[0]?.image?.imageBytes;
        if (b64) {
          const saved = saveBase64ImageToPublic(b64, roomSlugKey, req.styleTheme);
          return {
            imageUrl: saved.imageUrl,
            fileName: saved.fileName,
            providerUsed: 'GEMINI_IMAGEN',
            promptUsed: prompt,
            roomSpecUsed: roomSpec,
            generatedAt: new Date().toISOString()
          };
        }
      } catch {
        // Fall through to room-specific calibrated asset
      }
    }
  }

  // 3. Return strictly room-specific calibrated Villa 253 asset (never showing living room for other rooms)
  const fallback = getRoomSpecificVilla253Asset(roomSpec.roomId, roomSpec.name, req.styleTheme);
  return {
    imageUrl: fallback.imageUrl,
    fileName: fallback.fileName,
    providerUsed: 'CALIBRATED_VILLA253_ASSET',
    promptUsed: prompt,
    roomSpecUsed: roomSpec,
    generatedAt: new Date().toISOString()
  };
}

/**
 * Generates or calibrates room-specific interior renders for ALL 7 rooms in Villa 253
 * using the authoritative Wall Marking Drawing R0 dimensions and room-specific filenames.
 */
export async function generateAllVilla253RoomImages(options?: {
  styleTheme?: string;
  cctKelvin?: number;
  customPromptNotes?: string;
}): Promise<Record<string, InteriorRenderResult>> {
  const results: Record<string, InteriorRenderResult> = {};
  const roomSpecs = Object.values(VILLA_253_AUTHORITATIVE_SPECS);

  for (const spec of roomSpecs) {
    const result = await generateInteriorConceptRender({
      roomId: spec.roomId,
      roomName: spec.name,
      roomDimensions: spec.dimensionText,
      layoutTitle: `Villa 253 R0 Verified Layout (${spec.dimensionText})`,
      styleTheme:
        options?.styleTheme ||
        'Modern Warm Luxury (Villa 253 R0 Teak, Travertine & 2700K Architectural Lighting)',
      cctKelvin: options?.cctKelvin || 2700,
      customPromptNotes: options?.customPromptNotes
    });
    results[spec.roomId] = result;
  }

  return results;
}

/**
 * Generates 3 calibrated interior options for a given room specification,
 * grounded in the Villa 253 Wall Marking Drawing R0 (10-10-24) dimensions.
 */
export async function analyzeFloorPlanAndGenerateOptions(specs: {
  roomId?: string;
  roomName: string;
  lengthFt?: number;
  widthFt?: number;
  facingDirection?: string;
}): Promise<any[]> {
  const r0Spec = resolveVilla253RoomSpecForRender(specs.roomId, specs.roomName);
  const lengthFt = specs.lengthFt || r0Spec.lengthFt;
  const widthFt = specs.widthFt || r0Spec.widthFt;

  return [
    {
      id: `OPT-${r0Spec.code}-1`,
      optionNumber: 1,
      title: `Option 1: Villa 253 R0 Signature ${r0Spec.shortLabel} Layout (${r0Spec.dimensionText})`,
      styleTheme: 'Modern Warm Luxury (Teak, Travertine & 2700K Architectural Coves)',
      summary: `Calibrated strictly to ${r0Spec.name} (${lengthFt}' × ${widthFt}', ${r0Spec.areaSqFt} sq.ft) respecting ${r0Spec.doorWindowMarks.join(', ')}.`,
      estimatedCost: r0Spec.areaSqFt * 1650
    },
    {
      id: `OPT-${r0Spec.code}-2`,
      optionNumber: 2,
      title: `Option 2: Biophilic Tropical Courtyard & Deck Flow (${r0Spec.dimensionText})`,
      styleTheme: 'Biophilic Tropical Eco-Luxe (Natural Rattan, Kota Stone & Timber Rafters)',
      summary: `Integrates ${r0Spec.name} with ${r0Spec.adjunctSpaces.join(' & ')} while maintaining 3.8ft clear walk passages.`,
      estimatedCost: r0Spec.areaSqFt * 1520
    },
    {
      id: `OPT-${r0Spec.code}-3`,
      optionNumber: 3,
      title: `Option 3: Vastu Shastra Harmonized Orientation (${r0Spec.dimensionText})`,
      styleTheme: 'Vastu Shastra Prana Sanctuary (Seasoned CP Teak & Brass Inlay)',
      summary: `North-Facing cardinal alignment for ${r0Spec.name} (${r0Spec.dimensionText}) with unobstructed solar daylighting.`,
      estimatedCost: r0Spec.areaSqFt * 1590
    }
  ];
}

/**
 * Generates a photorealistic interior render for a selected room option,
 * using the actual Villa 253 source floor plan + exact room dimensions and room-specific filename.
 */
export async function generatePhotorealisticInteriorRender(
  specs: {
    roomId?: string;
    roomName: string;
    lengthFt?: number;
    widthFt?: number;
    heightFt?: number;
    facingDirection?: string;
  },
  selectedOption: {
    title?: string;
    styleTheme?: string;
    summary?: string;
  }
): Promise<{
  imageUrl: string;
  fileName: string;
  verified2DLayoutUrl: string;
  isRealAiGenerated: boolean;
  promptUsed: string;
  roomDimensions: string;
}> {
  const r0Spec = resolveVilla253RoomSpecForRender(specs.roomId, specs.roomName);
  const res = await generateInteriorConceptRender({
    roomId: r0Spec.roomId,
    roomName: r0Spec.name,
    roomDimensions: r0Spec.dimensionText,
    layoutTitle: selectedOption.title || `Villa 253 R0 Layout (${r0Spec.dimensionText})`,
    styleTheme: selectedOption.styleTheme || 'Modern Warm Luxury',
    customPromptNotes: selectedOption.summary
  });

  return {
    imageUrl: res.imageUrl,
    fileName: res.fileName,
    verified2DLayoutUrl: '/assets/images/villa253_cad_blueprint_r0.svg',
    isRealAiGenerated: res.providerUsed !== 'CALIBRATED_VILLA253_ASSET',
    promptUsed: res.promptUsed,
    roomDimensions: r0Spec.dimensionText
  };
}

