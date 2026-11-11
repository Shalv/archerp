# Puter.js AI integration

Puter.js gives the browser keyless access to 500+ models — chat, image generation, OCR, speech — where the **signed-in Puter user pays for their own usage** ("user-pays"). There is no API key in this repo and no server-side AI bill.

- Docs: <https://docs.puter.com>
- SDK: `https://js.puter.com/v2/` (loaded from `index.html`)
- Requirement honoured in the app: the footer carries a **Powered by Puter** link to `https://developer.puter.com`.
- The app must be served over HTTP(S) (Puter refuses `file://`). `npm run dev` and `npm start` both satisfy this.

## The one rule

**AI writes prose and pixels. It never writes numbers.**

Quantities, rates, wastage, markups, GST and every total still come from the deterministic engine (`src/server/designStudioEngine.ts`, `calculateDeterministicTotals`). Puter output is stored next to those numbers, never inside them. That is why an AI render cannot change a BOQ line, and why the server endpoint below accepts a narrative and image URLs — nothing else.

## What is wired up today

| Where | AI action | Model | Fallback if Puter is unavailable |
| --- | --- | --- | --- |
| Studio step 1 — *Read plan with AI* | `img2txt` OCR of the uploaded sheet, then structured room extraction | AWS Textract (images) / `mistral-ocr-latest` (PDF), then `gpt-5.4-nano` | Manual room table / project survey rooms |
| Studio step 4-5 — *AI* / *Renders + narrative* | `txt2img` per room scheme + `chat` narrative | `gpt-image-2.6-flare`, `gpt-5.4-nano` | The seeded deterministic concepts and their Villa 253 reference images |

Every call goes through `src/services/puterAI.ts`; nothing calls the global `puter` object directly.

## Files

| File | Role |
| --- | --- |
| `src/services/puterAI.ts` | Typed wrapper: availability, chat, JSON chat, image generation, OCR, room extraction, narrative, room render, capability report, error normalisation |
| `index.html` | `<script src="https://js.puter.com/v2/">` |
| `src/components/designStudio/AIDesignStudioView.tsx` | Capability chip, *Read plan with AI*, AI consent modal, render/narrative actions, progress |
| `server.ts` | `POST /api/design-studio/:projectId/concepts/:conceptId/ai-enrich`, plus AI provenance on `/floor-plan` |
| `src/types/designStudio.ts` | `FloorPlanModel.aiExtraction`, `DesignConcept.aiGeneration` |

## API of the wrapper

```ts
import puterAI from '../services/puterAI';

await puterAI.getPuterCapability();       // { available, signedIn, note } - show this in the UI
await puterAI.chatText(prompt, { system, model, temperature });
await puterAI.chatJson<T>(prompt, { jsonSchema: { name, schema } });   // uses outputFormat json_schema
await puterAI.generateImage(prompt, { aspectRatio: '16:9', model });
await puterAI.ocrDocument(fileOrUrl, { provider: 'mistral', model: 'mistral-ocr-latest' });

// ERP-specific helpers
await puterAI.extractRoomsFromFloorPlan(file);   // OCR -> { rooms, confidenceNotes, ocrText }
await puterAI.enrichConceptNarrative({ conceptName, style, palette, rooms, budgetBand });
await puterAI.renderRoomScheme({ roomName, lengthFt, widthFt, ceilingHeightFt, materials, ... });
```

Errors are typed, so callers can branch instead of guessing:

- `PuterUnavailableError` (`code: 'PUTER_UNAVAILABLE'`) — script blocked, offline, or `window.puter` absent.
- `PuterCallError` with `code` (`upstream_failed`, `insufficient_funds`, `moderation_flagged`, `prompt_required`, `empty_response`, `invalid_json`, …) and `retryable: boolean`. `upstream_failed`, `rate_limited`, `timeout` and `network_error` are marked retryable; `insufficient_funds` and `moderation_flagged` are not — retrying those just burns time.

Response shapes differ per model family, so `extractText` normalises a plain string, `message.content`, content-part arrays (`[{ type: 'text', text }]`) and `toString()`; `parseJsonLoose` recovers JSON from fenced blocks, prose-wrapped JSON and trailing commas.

## Using it for other AI activities

The wrapper is deliberately generic. Adding a new AI surface is three lines:

```ts
const summary = await puterAI.chatText(
  `Summarise this DPR for the client in 3 sentences, no numbers: ${JSON.stringify(dpr)}`,
  { system: 'You are a construction project manager at Build Storys. Plain English, no promises.' }
);
```

Good next candidates, in the order they add value:

1. **CRM** — summarise a lead's communication log into "what the client actually wants" before the design pitch.
2. **DPR / site execution** — turn the day's activities, delays and photographs into a client-facing daily update.
3. **Procurement** — read a vendor quote PDF with `ocrDocument` and pre-fill the RFQ comparison (a human still approves the rate).
4. **Quality** — draft an NCR root-cause paragraph from the inspector's notes.
5. **Client portal** — a plain-language explanation of the current milestone and what is pending on the client's side.

Keep the same discipline for each: AI text in a field, numbers from the engine, and a visible "generated by" badge.

## Privacy and cost notes for a client demo

- The floor plan, brief and photographs leave the browser to the model provider **when you press an AI button**. Say this out loud before a live demo; for a client who is sensitive about drawings, run the deterministic path.
- Usage bills to whichever Puter account is signed in. A render costs credits; a chat call costs a fraction. The consent modal states how many images will be generated before it runs.
- `testMode: true` exists on every call (`puter.ai.chat(prompt, true)`, `txt2img(..., { test_mode: true })`, `img2txt(..., { testMode: true })`) and returns sample output without credits — useful for a dry run on stage.
- Generated image URLs are temporary. The app persists whatever `src` comes back (often a data URI) into the concept record; for long-lived assets, copy them to your own storage.

## Verification

- `npx tsc --noEmit` — clean.
- `src/services/puterAI.ts` — 30 assertions pass against a mocked `window.puter` (text normalisation, loose JSON, schema option, error mapping and retryability, blank-prompt rejection, OCR, room extraction, render prompt content).
- HTTP: `POST /ai-enrich` returns 200 and updates the concept; 400 on an empty payload; 400 on a room that is not part of the concept; 409 on an approved (locked) concept. `/floor-plan` records `aiExtraction` provenance and merges the model's confidence notes into the uncertainty list.
- BOQ generation after enrichment produces identical quantities and rates — the AI never touches pricing.
