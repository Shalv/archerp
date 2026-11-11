/**
 * Build Storys ERP - Puter.js AI client (browser-side, keyless)
 * -------------------------------------------------------------
 * Puter.js gives the browser direct access to 500+ models with no API key and
 * no backend: the signed-in Puter user pays for their own usage ("user-pays").
 * Docs: https://docs.puter.com  ·  SDK: https://js.puter.com/v2/
 *
 * Design rules for this ERP:
 *
 *  1. AI is an ASSIST, never the source of truth. Quantities, rates, margins
 *     and totals always come from the deterministic engine. Puter may write
 *     prose, read a drawing, or paint a render - it never sets a number that
 *     lands in a BOQ.
 *  2. Everything degrades. If the script is blocked, the user has no credits,
 *     or the model errors, each call throws a typed `PuterUnavailableError`
 *     (or `PuterCallError`) and the caller keeps the deterministic result.
 *  3. Responses are normalised. Model families return different shapes
 *     (string content, content-part arrays, objects), so `extractText` handles
 *     all of them rather than assuming one.
 *  4. No secrets. There is no key to configure, and none is stored here.
 */

// ---------------------------------------------------------------------------
// Minimal ambient types for the global the SDK installs on `window`
// ---------------------------------------------------------------------------
export interface PuterChatMessage {
  role?: 'system' | 'user' | 'assistant';
  content: unknown;
}

export interface PuterChatResponse {
  message?: { role?: string; content?: unknown };
  text?: string;
  content?: unknown;
  toString?: () => string;
}

export interface PuterAI {
  /** puter.ai.chat(prompt, options) | (prompt, testMode, options) | (messages, testMode, options) */
  chat: (prompt: any, testModeOrOptions?: any, options?: any) => Promise<any>;
  txt2img: (prompt: any, testModeOrOptions?: any) => Promise<any>;
  img2txt: (source: any, testModeOrOptions?: any) => Promise<any>;
  listModels?: (provider?: string) => Promise<any>;
}

export interface PuterGlobal {
  ai: PuterAI;
  auth?: {
    isSignedIn?: () => boolean;
    signIn?: () => Promise<unknown>;
    getUser?: () => Promise<unknown>;
  };
  print?: (text: string) => void;
}

declare global {
  interface Window {
    puter?: PuterGlobal;
  }
}

// ---------------------------------------------------------------------------
// Errors
// ---------------------------------------------------------------------------
export class PuterUnavailableError extends Error {
  code = 'PUTER_UNAVAILABLE' as const;
  constructor(message = 'Puter.js is not available in this browser session.') {
    super(message);
    this.name = 'PuterUnavailableError';
  }
}

export class PuterCallError extends Error {
  code: string;
  retryable: boolean;
  constructor(message: string, code = 'PUTER_CALL_FAILED', retryable = false) {
    super(message);
    this.name = 'PuterCallError';
    this.code = code;
    this.retryable = retryable;
  }
}

const RETRYABLE = new Set(['upstream_failed', 'rate_limited', 'timeout', 'network_error']);

function toCallError(err: any): PuterCallError {
  if (err instanceof PuterCallError) return err;
  const code = String(err?.errorCode || err?.code || err?.message || 'PUTER_CALL_FAILED');
  const message =
    err?.message ||
    err?.error?.message ||
    (typeof err === 'string' ? err : 'The AI request failed.');
  return new PuterCallError(String(message), code, RETRYABLE.has(code));
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------
export const PUTER_SCRIPT_URL = 'https://js.puter.com/v2/';

export function isPuterAvailable(): boolean {
  return typeof window !== 'undefined' && !!window.puter?.ai;
}

/**
 * Resolves true once `window.puter.ai` exists. The script tag is async, so a
 * click can land before it finishes loading - callers wait instead of failing.
 */
export async function waitForPuter(timeoutMs = 8000): Promise<boolean> {
  if (isPuterAvailable()) return true;
  if (typeof window === 'undefined') return false;
  const started = Date.now();
  while (Date.now() - started < timeoutMs) {
    await new Promise(r => setTimeout(r, 150));
    if (isPuterAvailable()) return true;
  }
  return false;
}

async function requirePuter(): Promise<PuterGlobal> {
  if (!(await waitForPuter())) throw new PuterUnavailableError();
  return window.puter as PuterGlobal;
}

// ---------------------------------------------------------------------------
// Response normalisation
// ---------------------------------------------------------------------------
/** Pulls plain text out of any chat response shape Puter may return. */
export function extractText(response: any): string {
  if (response == null) return '';
  if (typeof response === 'string') return response;

  // { message: { content: 'text' | [{type:'text', text:'...'}] } }
  const content = response?.message?.content ?? response?.content ?? response?.text;
  if (typeof content === 'string') return content;
  if (Array.isArray(content)) {
    return content
      .map(part => {
        if (typeof part === 'string') return part;
        if (typeof part?.text === 'string') return part.text;
        if (typeof part?.content === 'string') return part.content;
        return '';
      })
      .join('')
      .trim();
  }
  if (typeof response?.toString === 'function') {
    const asString = String(response);
    if (asString && asString !== '[object Object]') return asString;
  }
  return '';
}

/** Best-effort JSON extraction: fenced blocks, leading prose, trailing commas. */
export function parseJsonLoose<T = unknown>(text: string): T | null {
  if (!text) return null;
  const candidates: string[] = [];
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenced?.[1]) candidates.push(fenced[1]);
  const firstBrace = text.indexOf('{');
  const lastBrace = text.lastIndexOf('}');
  if (firstBrace >= 0 && lastBrace > firstBrace) candidates.push(text.slice(firstBrace, lastBrace + 1));
  const firstBracket = text.indexOf('[');
  const lastBracket = text.lastIndexOf(']');
  if (firstBracket >= 0 && lastBracket > firstBracket) candidates.push(text.slice(firstBracket, lastBracket + 1));
  candidates.push(text);

  for (const candidate of candidates) {
    const cleaned = candidate.replace(/,\s*([}\]])/g, '$1').trim();
    try {
      return JSON.parse(cleaned) as T;
    } catch {
      /* try the next candidate */
    }
  }
  return null;
}

// ---------------------------------------------------------------------------
// Chat
// ---------------------------------------------------------------------------
export interface ChatOptions {
  model?: string;
  system?: string;
  temperature?: number;
  maxTokens?: number;
  /** JSON schema for `outputFormat` - strongly preferred over "reply in JSON" */
  jsonSchema?: { name: string; schema: Record<string, unknown>; strict?: boolean };
  signal?: AbortSignal;
  /** Use Puter's test API - no credits consumed. Great for demos. */
  testMode?: boolean;
}

export const DEFAULT_CHAT_MODEL = 'gpt-5.4-nano';

export async function chatText(prompt: string, options: ChatOptions = {}): Promise<string> {
  const puter = await requirePuter();
  const messages: PuterChatMessage[] = [];
  if (options.system) messages.push({ role: 'system', content: options.system });
  messages.push({ role: 'user', content: prompt });

  const callOptions: Record<string, unknown> = {
    model: options.model || DEFAULT_CHAT_MODEL
  };
  if (options.temperature !== undefined) callOptions.temperature = options.temperature;
  if (options.maxTokens !== undefined) callOptions.max_tokens = options.maxTokens;
  if (options.signal) callOptions.signal = options.signal;
  if (options.jsonSchema) {
    callOptions.outputFormat = {
      type: 'json_schema',
      name: options.jsonSchema.name,
      schema: options.jsonSchema.schema,
      strict: options.jsonSchema.strict ?? true
    };
  }

  try {
    const response = await puter.ai.chat(messages, options.testMode === true, callOptions);
    const text = extractText(response);
    if (!text) throw new PuterCallError('The model returned an empty response.', 'empty_response', true);
    return text;
  } catch (err) {
    throw toCallError(err);
  }
}

/** Chat with a JSON schema; falls back to loose parsing of the raw text. */
export async function chatJson<T>(prompt: string, options: ChatOptions & { schemaName?: string } = {}): Promise<T> {
  const text = await chatText(prompt, options);
  const parsed = parseJsonLoose<T>(text);
  if (parsed == null) {
    throw new PuterCallError('The model did not return valid JSON.', 'invalid_json', true);
  }
  return parsed;
}

// ---------------------------------------------------------------------------
// Images
// ---------------------------------------------------------------------------
export interface ImageOptions {
  model?: string;
  aspectRatio?: string; // '16:9'
  width?: number;
  height?: number;
  testMode?: boolean;
}

/**
 * Generates one image and returns a src (hosted URL or data URI).
 * Hosted URLs are temporary, so callers that need persistence should copy the
 * src into their own store (the ERP keeps it in the concept record).
 */
export async function generateImage(prompt: string, options: ImageOptions = {}): Promise<string> {
  const puter = await requirePuter();
  if (!prompt || !prompt.trim()) {
    throw new PuterCallError('An image prompt is required.', 'prompt_required');
  }
  const callOptions: Record<string, unknown> = {};
  if (options.model) callOptions.model = options.model;
  if (options.aspectRatio) callOptions.aspect_ratio = options.aspectRatio;
  if (options.width && options.height) {
    callOptions.width = options.width;
    callOptions.height = options.height;
  }
  try {
    const image = await puter.ai.txt2img(prompt, { ...callOptions, test_mode: options.testMode === true });
    const src = typeof image === 'string' ? image : image?.src || image?.valueOf?.();
    if (!src || typeof src !== 'string') {
      throw new PuterCallError('The image model returned no image data.', 'empty_image', true);
    }
    return src;
  } catch (err) {
    throw toCallError(err);
  }
}

// ---------------------------------------------------------------------------
// OCR (floor plans, scanned briefs, vendor quotes)
// ---------------------------------------------------------------------------
export interface OcrOptions {
  /** 'aws-textract' (default, single page) or a Mistral OCR model (multi-page, Markdown) */
  model?: string;
  provider?: 'aws-textract' | 'mistral';
  testMode?: boolean;
}

export async function ocrDocument(source: File | Blob | string, options: OcrOptions = {}): Promise<string> {
  const puter = await requirePuter();
  const callOptions: Record<string, unknown> = {};
  if (options.model) callOptions.model = options.model;
  if (options.provider) callOptions.provider = options.provider;
  if (options.testMode) callOptions.testMode = true;
  try {
    const text = await puter.ai.img2txt(source, callOptions);
    return typeof text === 'string' ? text : extractText(text);
  } catch (err) {
    throw toCallError(err);
  }
}

// ---------------------------------------------------------------------------
// Domain helpers used by the ERP
// ---------------------------------------------------------------------------
export interface ExtractedRoom {
  name: string;
  lengthFt: number;
  widthFt: number;
  ceilingHeightFt?: number;
  floor?: string;
  notes?: string;
}

const ROOM_EXTRACTION_SCHEMA = {
  name: 'floor_plan_rooms',
  schema: {
    type: 'object',
    additionalProperties: false,
    required: ['rooms', 'confidenceNotes'],
    properties: {
      rooms: {
        type: 'array',
        items: {
          type: 'object',
          additionalProperties: false,
          required: ['name', 'lengthFt', 'widthFt'],
          properties: {
            name: { type: 'string' },
            lengthFt: { type: 'number' },
            widthFt: { type: 'number' },
            ceilingHeightFt: { type: 'number' },
            floor: { type: 'string' },
            notes: { type: 'string' }
          }
        }
      },
      confidenceNotes: { type: 'array', items: { type: 'string' } }
    }
  }
};

/**
 * Reads a floor plan file and returns structured rooms.
 * Two stages: OCR the sheet, then have a model map the text to rooms.
 * Nothing is invented - the model is told to return only dimensions it can see
 * and to explain any gap in `confidenceNotes`.
 */
export async function extractRoomsFromFloorPlan(
  file: File | Blob | string,
  options: { ocrModel?: string; chatModel?: string; testMode?: boolean } = {}
): Promise<{ rooms: ExtractedRoom[]; confidenceNotes: string[]; ocrText: string }> {
  const isPdf = typeof file !== 'string' && (file as File).type === 'application/pdf';
  const ocrText = await ocrDocument(file, {
    // Textract is single-page; use Mistral OCR for PDFs so multi-page plans work.
    model: options.ocrModel || (isPdf ? 'mistral-ocr-latest' : undefined),
    provider: isPdf ? 'mistral' : undefined,
    testMode: options.testMode
  });

  const prompt = [
    'You are reading OCR text from an architectural floor plan.',
    'Extract every enclosed room or space with its dimensions in FEET.',
    'Rules:',
    '- Convert feet-inches to decimal feet (e.g. 14\'-6" becomes 14.5).',
    '- Convert metres to feet (1 m = 3.28084 ft) and note the conversion.',
    '- Never guess a dimension that is not printed. If a room has no printed size, omit that room.',
    '- Use the printed room label as the name; keep it short.',
    '- Put every ambiguity (unclear number, possible scale issue, missing ceiling height) in confidenceNotes.',
    '',
    'OCR TEXT:',
    ocrText.slice(0, 12000)
  ].join('\n');

  const result = await chatJson<{ rooms: ExtractedRoom[]; confidenceNotes: string[] }>(prompt, {
    model: options.chatModel || DEFAULT_CHAT_MODEL,
    jsonSchema: ROOM_EXTRACTION_SCHEMA,
    temperature: 0,
    testMode: options.testMode
  });

  const rooms = (result.rooms || []).filter(
    room => room && room.name && Number(room.lengthFt) > 0 && Number(room.widthFt) > 0
  );
  return { rooms, confidenceNotes: result.confidenceNotes || [], ocrText };
}

/**
 * Rewrites a concept's narrative in the studio's voice.
 * Only prose is produced - no quantities, no rates, no totals.
 */
export async function enrichConceptNarrative(input: {
  conceptName: string;
  style: string;
  palette: string[];
  rooms: { name: string; areaSqFt: number; materials: string[] }[];
  budgetBand: string;
  clientInstructions?: string[];
  model?: string;
}): Promise<string> {
  const prompt = [
    `Write a client-facing interior design narrative for the concept "${input.conceptName}" (${input.style}).`,
    `Palette: ${input.palette.join(' / ')}. Budget band: ${input.budgetBand}.`,
    `Rooms: ${input.rooms.map(r => `${r.name} (${r.areaSqFt} sq.ft): ${r.materials.join(', ')}`).join('; ')}.`,
    input.clientInstructions?.length ? `Client instructions to honour: ${input.clientInstructions.join(' | ')}.` : '',
    'Requirements: 90-140 words, warm and specific, no bullet points, no prices or quantities,',
    'no claims about structural changes, and no invented brand names. End with one sentence on how it will age well.'
  ]
    .filter(Boolean)
    .join('\n');

  return chatText(prompt, {
    model: input.model || DEFAULT_CHAT_MODEL,
    temperature: 0.6,
    maxTokens: 400,
    system:
      'You are a senior interior designer at Build Storys. You describe design intent in plain, confident English. You never quote prices, quantities or warranties.'
  });
}

/**
 * Builds a geometry-aware image prompt for one room scheme and renders it.
 * The room dimensions are in the prompt so the render matches the plan.
 */
export async function renderRoomScheme(input: {
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
  model?: string;
  aspectRatio?: string;
  testMode?: boolean;
}): Promise<{ imageUrl: string; prompt: string }> {
  const prompt = [
    `Photorealistic interior render of a ${input.roomName} (${input.roomType.toLowerCase().replace(/_/g, ' ')})`,
    `${input.lengthFt} ft by ${input.widthFt} ft, ${input.ceilingHeightFt} ft ceiling - keep this proportion`,
    `design concept: ${input.conceptName} (${input.style})`,
    `palette: ${input.palette.join(', ')}`,
    `materials: ${input.materials.slice(0, 6).join('; ')}`,
    input.furniture.length ? `furniture: ${input.furniture.slice(0, 4).join('; ')}` : '',
    input.lighting.length ? `lighting: ${input.lighting.slice(0, 3).join('; ')}` : '',
    'natural daylight, architectural photography, 24mm lens at eye level, no people, no text, no watermark'
  ]
    .filter(Boolean)
    .join(', ');

  const imageUrl = await generateImage(prompt, {
    model: input.model,
    aspectRatio: input.aspectRatio || '16:9',
    testMode: input.testMode
  });
  return { imageUrl, prompt };
}

// ---------------------------------------------------------------------------
// Capability report (shown in the UI so the demo never lies about AI state)
// ---------------------------------------------------------------------------
export interface PuterCapability {
  available: boolean;
  signedIn?: boolean;
  scriptUrl: string;
  note: string;
}

export async function getPuterCapability(): Promise<PuterCapability> {
  const available = await waitForPuter(3000);
  let signedIn: boolean | undefined;
  if (available && window.puter?.auth?.isSignedIn) {
    try {
      signedIn = window.puter.auth.isSignedIn();
    } catch {
      signedIn = undefined;
    }
  }
  return {
    available,
    signedIn,
    scriptUrl: PUTER_SCRIPT_URL,
    note: available
      ? 'Puter AI ready - models run from the browser on the signed-in Puter account (user-pays, no server key).'
      : 'Puter AI not loaded (script blocked or offline). The deterministic design engine is being used instead.'
  };
}

export const puterAI = {
  isPuterAvailable,
  waitForPuter,
  chatText,
  chatJson,
  generateImage,
  ocrDocument,
  extractRoomsFromFloorPlan,
  enrichConceptNarrative,
  renderRoomScheme,
  getPuterCapability,
  extractText,
  parseJsonLoose,
  DEFAULT_CHAT_MODEL,
  PUTER_SCRIPT_URL
};

export default puterAI;
