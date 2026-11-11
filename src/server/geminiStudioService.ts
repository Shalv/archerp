/**
 * Build Storys ERP - GEMINI AI FOR THE DESIGN STUDIO (server-side)
 * ===============================================================
 * All model calls for M04-C run here, on the server, with GEMINI_API_KEY.
 * No API key ever reaches the browser, and no third-party script is loaded.
 *
 * Division of labour, unchanged from the deterministic engine:
 *   - Gemini reads a drawing, writes prose and paints a concept image.
 *   - Gemini NEVER sets a quantity, rate, total or BOQ line. Those stay in
 *     designStudioEngine.ts, computed from the confirmed floor plan model.
 *   - Every output is checked before it is stored: a narrative that contains
 *     prices is rejected, and extracted rooms are clamped to plausible values
 *     and must still pass the human confirmation gate in the studio.
 *
 * When GEMINI_API_KEY is absent or invalid, every function throws
 * `AiNotConfiguredError` / `AiCallError` and the studio falls back to its
 * deterministic path with a visible message. Nothing silently pretends.
 */

import type { GoogleGenAI } from '@google/genai';

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------
const DEFAULT_TEXT_MODEL = process.env.GEMINI_TEXT_MODEL || 'gemini-2.5-flash';
const DEFAULT_IMAGE_MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image';
const REQUEST_TIMEOUT_MS = Number(process.env.GEMINI_TIMEOUT_MS || 60_000);

export interface AiStatus {
  provider: 'gemini';
  configured: boolean;
  textModel: string;
  imageModel: string;
  imageGenerationEnabled: boolean;
  note: string;
}

function readKey(): string {
  const key = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  if (!key || key.trim() === '' || key === 'MY_GEMINI_API_KEY') return '';
  return key.trim();
}

let client: GoogleGenAI | null = null;
let remoteDenied = false;
let sdkUnavailableReason = '';

/**
 * The SDK is imported lazily on first use. If the dependency is missing or
 * fails to load in a deployment, the AI routes degrade to "not configured"
 * instead of taking the whole server down at module load.
 */
async function loadSdk(): Promise<new (opts: any) => GoogleGenAI> {
  try {
    const mod: any = await import('@google/genai');
    const Ctor = mod?.GoogleGenAI || mod?.default?.GoogleGenAI || mod?.default;
    if (typeof Ctor !== 'function') throw new Error('GoogleGenAI export not found');
    return Ctor;
  } catch (err: any) {
    sdkUnavailableReason = String(err?.message || err).slice(0, 200);
    throw new AiNotConfiguredError(
      `The Gemini SDK (@google/genai) could not be loaded on the server (${sdkUnavailableReason}). Run npm install in the deployment, then retry.`
    );
  }
}

async function getClient(): Promise<GoogleGenAI> {
  const apiKey = readKey();
  if (!apiKey) {
    throw new AiNotConfiguredError(
      'Gemini is not configured on the server. Set GEMINI_API_KEY in the environment (see docs/GEMINI_AI.md) and restart.'
    );
  }
  if (remoteDenied) {
    throw new AiCallError('Gemini rejected this API key earlier in this session (permission denied). Fix the key and restart the server.', 'PERMISSION_DENIED');
  }
  if (!client) {
    const Ctor = await loadSdk();
    client = new Ctor({ apiKey, httpOptions: { headers: { 'User-Agent': 'buildstorys-erp' } } });
  }
  return client;
}

export function getAiStatus(): AiStatus {
  const configured = Boolean(readKey()) && !remoteDenied && !sdkUnavailableReason;
  return {
    provider: 'gemini',
    configured,
    textModel: DEFAULT_TEXT_MODEL,
    imageModel: DEFAULT_IMAGE_MODEL,
    imageGenerationEnabled: configured,
    note: configured
      ? `Gemini ${DEFAULT_TEXT_MODEL} is configured on the server. Drawings, narratives and renders run server-side; quantities and rates stay deterministic.`
      : sdkUnavailableReason
        ? `Gemini SDK failed to load on the server (${sdkUnavailableReason}). The studio runs on the deterministic engine.`
        : 'Gemini is not configured (no GEMINI_API_KEY). The studio runs on the deterministic engine only.'
  };
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------
export class AiNotConfiguredError extends Error {
  code = 'AI_NOT_CONFIGURED' as const;
  constructor(message: string) {
    super(message);
    this.name = 'AiNotConfiguredError';
  }
}

export class AiCallError extends Error {
  code = 'AI_CALL_FAILED' as const;
  retryable: boolean;
  upstream?: string;
  constructor(message: string, upstream?: string) {
    super(message);
    this.name = 'AiCallError';
    this.upstream = upstream;
    this.retryable = !['PERMISSION_DENIED', 'API_KEY_INVALID', 'INVALID_ARGUMENT', 'SAFETY'].includes(String(upstream || ''));
  }
}

function handleError(context: string, err: any): never {
  const message = String(err?.message || err || 'unknown error');
  if (/PERMISSION_DENIED|denied access|API_KEY_INVALID|403/.test(message)) remoteDenied = true;
  const upstream = /PERMISSION_DENIED|403/.test(message)
    ? 'PERMISSION_DENIED'
    : /API_KEY_INVALID/.test(message)
      ? 'API_KEY_INVALID'
      : /SAFETY|blocked/.test(message)
        ? 'SAFETY'
        : /429|RESOURCE_EXHAUSTED|quota/i.test(message)
          ? 'RATE_LIMITED'
          : 'UPSTREAM_ERROR';
  console.warn(`[Gemini] ${context}: ${message.slice(0, 300)}`);
  throw new AiCallError(`${context} failed: ${message.slice(0, 240)}`, upstream);
}

async function withTimeout<T>(promise: Promise<T>, label: string): Promise<T> {
  let timer: NodeJS.Timeout;
  const timeout = new Promise<never>((_, reject) => {
    timer = setTimeout(() => reject(new AiCallError(`${label} timed out after ${REQUEST_TIMEOUT_MS} ms.`, 'TIMEOUT')), REQUEST_TIMEOUT_MS);
  });
  try {
    return await Promise.race([promise, timeout]);
  } finally {
    clearTimeout(timer!);
  }
}

// ---------------------------------------------------------------------------
// 1. Read a floor plan (vision + OCR in one pass)
// ---------------------------------------------------------------------------
export interface ExtractedRoomDraft {
  name: string;
  lengthFt: number;
  widthFt: number;
  ceilingHeightFt?: number;
  floor?: string;
  notes?: string;
}

export interface PlanExtractionResult {
  rooms: ExtractedRoomDraft[];
  confidenceNotes: string[];
  rawText: string;
  model: string;
}

const PLAN_SCHEMA = {
  type: 'object',
  properties: {
    rooms: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: { type: 'string' },
          lengthFt: { type: 'number' },
          widthFt: { type: 'number' },
          ceilingHeightFt: { type: 'number' },
          floor: { type: 'string' },
          notes: { type: 'string' }
        },
        required: ['name', 'lengthFt', 'widthFt']
      }
    },
    confidenceNotes: { type: 'array', items: { type: 'string' } }
  },
  required: ['rooms', 'confidenceNotes']
};

/**
 * Reads a floor plan image or PDF and returns dimensioned rooms.
 * Only printed dimensions are accepted; anything ambiguous must be listed in
 * `confidenceNotes`, and the studio still requires human confirmation.
 */
export async function extractRoomsFromPlan(input: {
  base64: string;
  mimeType: string;
  fileName?: string;
}): Promise<PlanExtractionResult> {
  const ai = await getClient();
  const prompt = [
    'You are reading an architectural floor plan for a construction ERP.',
    'Return every enclosed room or space with its dimensions converted to FEET (decimal).',
    'Rules:',
    '- Convert feet-inches to decimal feet (14\'-6" = 14.5). Convert metres at 3.28084.',
    '- Only use dimensions printed on the drawing. Never estimate from the picture.',
    '- If a room has no printed dimension, omit it and say so in confidenceNotes.',
    '- Use the printed room label as the name, shortened to 40 characters.',
    '- Add every ambiguity (illegible figure, unstated ceiling height, possible scale issue) to confidenceNotes.',
    '- Do not invent doors, windows, materials or brands.',
    input.fileName ? `File: ${input.fileName}` : ''
  ]
    .filter(Boolean)
    .join('\n');

  let response: any;
  try {
    response = await withTimeout(
      ai.models.generateContent({
        model: DEFAULT_TEXT_MODEL,
        contents: [
          {
            role: 'user',
            parts: [
              { text: prompt },
              { inlineData: { mimeType: input.mimeType, data: input.base64 } }
            ]
          }
        ],
        config: {
          responseMimeType: 'application/json',
          responseSchema: PLAN_SCHEMA as any,
          temperature: 0
        }
      }),
      'Floor plan read'
    );
  } catch (err) {
    handleError('Reading the floor plan', err);
  }

  const text = String((response as any)?.text || '');
  const parsed = safeJson<{ rooms: ExtractedRoomDraft[]; confidenceNotes: string[] }>(text);
  if (!parsed) {
    throw new AiCallError('Gemini returned a response that could not be read as rooms. Try a clearer scan, or enter the dimensions manually.', 'UNPARSABLE');
  }

  // Clamp to plausible residential dimensions - a bad read must not create a
  // 400 ft room that then drives a quantity.
  const notes = [...(parsed.confidenceNotes || [])];
  const rooms = (parsed.rooms || [])
    .filter(r => r && typeof r.name === 'string' && Number(r.lengthFt) > 0 && Number(r.widthFt) > 0)
    .map(r => {
      const lengthFt = clamp(Number(r.lengthFt), 3, 80, notes, r.name, 'length');
      const widthFt = clamp(Number(r.widthFt), 3, 80, notes, r.name, 'width');
      const ceilingHeightFt = r.ceilingHeightFt ? clamp(Number(r.ceilingHeightFt), 7, 20, notes, r.name, 'ceiling height') : undefined;
      return { ...r, name: r.name.slice(0, 60), lengthFt, widthFt, ceilingHeightFt };
    });

  if (!rooms.length) {
    throw new AiCallError('No dimensioned rooms were found on that sheet. Upload a plan with printed dimensions, or enter the room table manually.', 'NO_ROOMS');
  }

  return { rooms, confidenceNotes: notes, rawText: text.slice(0, 4000), model: DEFAULT_TEXT_MODEL };
}

function clamp(value: number, min: number, max: number, notes: string[], roomName: string, label: string): number {
  if (!Number.isFinite(value)) {
    notes.push(`${roomName}: ${label} could not be read - 10 ft assumed, confirm on site.`);
    return 10;
  }
  if (value < min || value > max) {
    const fixed = Math.min(max, Math.max(min, value));
    notes.push(`${roomName}: ${label} read as ${value} ft, outside the plausible range - clamped to ${fixed} ft. Confirm before pricing.`);
    return fixed;
  }
  return Math.round(value * 100) / 100;
}

function safeJson<T>(text: string): T | null {
  if (!text) return null;
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidates = [fenced?.[1], text.slice(text.indexOf('{'), text.lastIndexOf('}') + 1), text].filter(Boolean) as string[];
  for (const candidate of candidates) {
    try {
      return JSON.parse(candidate.replace(/,\s*([}\]])/g, '$1')) as T;
    } catch {
      /* next */
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// 2. Concept narrative (prose only, never money)
// ---------------------------------------------------------------------------
export interface NarrativeInput {
  conceptName: string;
  style: string;
  budgetBand: string;
  palette: string[];
  rooms: { name: string; areaSqFt: number; materials: string[] }[];
  clientInstructions?: string[];
  propertyType?: string;
}

export interface NarrativeResult {
  text: string;
  model: string;
  sanitised: boolean;
}

/**
 * Writes the client-facing narrative. Output is rejected if it contains a
 * price, a quantity claim or a warranty promise - those are commercial facts
 * that come from the BOQ, not from a language model.
 */
export async function writeConceptNarrative(input: NarrativeInput): Promise<NarrativeResult> {
  const ai = await getClient();
  const prompt = [
    `Write a client-facing interior design narrative for "${input.conceptName}" (${input.style}).`,
    input.propertyType ? `Property: ${input.propertyType.toLowerCase().replace(/_/g, ' ')}.` : '',
    `Budget band: ${input.budgetBand.toLowerCase()}. Palette: ${input.palette.join(' / ')}.`,
    `Rooms: ${input.rooms.map(r => `${r.name} (${r.areaSqFt} sq.ft): ${r.materials.join(', ')}`).join('; ')}.`,
    input.clientInstructions?.length ? `Client instructions to honour: ${input.clientInstructions.join(' | ')}.` : '',
    'Requirements: 110-150 words, warm and specific, two short paragraphs, no bullet points.',
    'Never state a price, quantity, area total, timeline or warranty. Never invent a brand or a product code.',
    'End with one sentence on how the scheme will age well.'
  ]
    .filter(Boolean)
    .join('\n');

  let response: any;
  try {
    response = await withTimeout(
      ai.models.generateContent({
        model: DEFAULT_TEXT_MODEL,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        config: {
          temperature: 0.6,
          systemInstruction:
            'You are a senior interior designer at Build Storys. You describe design intent in plain, confident English. ' +
            'You never quote prices, quantities, durations or warranties, and you never invent brands.'
        }
      }),
      'Narrative generation'
    );
  } catch (err) {
    handleError('Writing the concept narrative', err);
  }

  const raw = String((response as any)?.text || '').trim();
  if (raw.length < 40) {
    throw new AiCallError('Gemini returned an empty narrative.', 'EMPTY');
  }

  // Commercial facts belong to the BOQ. Strip them if the model slipped.
  const moneyPattern = /(₹|rs\.?|inr)\s?[\d,]+(\.\d+)?(\s?(lakh|lac|crore|k))?/gi;
  const sanitised = moneyPattern.test(raw);
  const text = sanitised
    ? raw.replace(moneyPattern, 'as per the approved estimate').replace(/\s{2,}/g, ' ')
    : raw;

  return { text, model: DEFAULT_TEXT_MODEL, sanitised };
}

// ---------------------------------------------------------------------------
// 3. Room render (image generation)
// ---------------------------------------------------------------------------
export interface RenderInput {
  prompt: string;
  aspectRatio?: string;
}

export interface RenderResult {
  dataUri: string;
  mimeType: string;
  model: string;
}

/**
 * Generates one interior render. The prompt is built by the caller from the
 * approved room geometry and materials, so the image cannot drift from the
 * specification. Returns a data URI the studio stores as a PENDING asset.
 */
export async function renderRoom(input: RenderInput): Promise<RenderResult> {
  const ai = await getClient();
  let response: any;
  try {
    response = await withTimeout(
      ai.models.generateContent({
        model: DEFAULT_IMAGE_MODEL,
        contents: [{ role: 'user', parts: [{ text: input.prompt }] }],
        config: {
          imageConfig: { aspectRatio: input.aspectRatio || '16:9' } as any
        }
      }),
      'Render generation'
    );
  } catch (err) {
    handleError('Generating the room render', err);
  }

  const parts: any[] = response?.candidates?.[0]?.content?.parts || [];
  const imagePart = parts.find(p => p?.inlineData?.mimeType?.startsWith('image/'));
  if (!imagePart) {
    throw new AiCallError(
      'Gemini did not return an image. Image output needs a model such as gemini-2.5-flash-image (set GEMINI_IMAGE_MODEL).',
      'NO_IMAGE'
    );
  }
  const mimeType = imagePart.inlineData.mimeType;
  const data = imagePart.inlineData.data;
  return { dataUri: `data:${mimeType};base64,${data}`, mimeType, model: DEFAULT_IMAGE_MODEL };
}

// ---------------------------------------------------------------------------
// 4. Prompt builder shared with the engine (kept here so prompt and render
//    cannot diverge)
// ---------------------------------------------------------------------------
export function buildRoomRenderPrompt(input: {
  conceptName: string;
  style: string;
  palette: string[];
  roomName: string;
  roomType: string;
  lengthFt: number;
  widthFt: number;
  ceilingHeightFt: number;
  materials: string[];
  furniture: string[];
  lighting: string[];
}): string {
  return [
    `Photorealistic interior render of a ${input.roomName} (${input.roomType.toLowerCase().replace(/_/g, ' ')})`,
    `${input.lengthFt} ft by ${input.widthFt} ft with a ${input.ceilingHeightFt} ft ceiling - keep this proportion`,
    `design concept: ${input.conceptName} (${input.style})`,
    `palette: ${input.palette.join(', ')}`,
    `materials: ${input.materials.slice(0, 6).join('; ')}`,
    input.furniture.length ? `furniture: ${input.furniture.slice(0, 4).join('; ')}` : '',
    input.lighting.length ? `lighting: ${input.lighting.slice(0, 3).join('; ')}` : '',
    'natural daylight, architectural photography, 24mm lens at eye level, no people, no text, no watermark'
  ]
    .filter(Boolean)
    .join(', ');
}
