# Gemini AI in Build Storys — setup, guards and behaviour

All AI for the Design Studio (M04-C) and the Design Twin (M04-D) runs **server-side** through Google Gemini. There is no API key in the browser, no third-party SDK script, and no user-paid model account.

- Service: `src/server/geminiStudioService.ts`
- Routes: `/api/ai/status`, `/api/ai/studio/extract-plan`, `/api/design-studio/:id/concepts/:cid/ai-generate`
- SDK: `@google/genai` (already a dependency)

## 1. Configure

```bash
# .env  (or your host's environment variables)
GEMINI_API_KEY=your-key-from-aistudio

# optional overrides
GEMINI_TEXT_MODEL=gemini-2.5-flash        # vision + narrative
GEMINI_IMAGE_MODEL=gemini-2.5-flash-image # room renders
GEMINI_TIMEOUT_MS=60000
```

Restart the server. `GET /api/ai/status` returns:

```json
{ "provider": "gemini", "configured": true, "textModel": "gemini-2.5-flash",
  "imageModel": "gemini-2.5-flash-image", "imageGenerationEnabled": true, "note": "…" }
```

The studio header shows **Gemini · gemini-2.5-flash** when configured, **Gemini not configured** when not. The chip is driven by the server, so it cannot claim AI is available when it isn't.

## 2. What each call does

| Action | Route | Model | Output |
| --- | --- | --- | --- |
| Read a floor plan | `POST /api/ai/studio/extract-plan` | text model (vision) | rooms in feet + `confidenceNotes` |
| Concept narrative | `POST …/concepts/:cid/ai-generate` (`narrative: true`) | text model | 110-150 words of prose |
| Room renders | same route (`renderRoomIds: [...]`) | image model | one data-URI image per room |

The floor-plan call takes `{ base64, mimeType, fileName }` (PNG, JPEG or PDF, up to 12 MB) and uses a JSON response schema, so the output is structured rather than prose that has to be parsed.

## 3. The guards (this is the important part)

1. **AI never writes a number that reaches the BOQ.** Quantities, rates, wastage, markups, GST and totals come from `designStudioEngine.ts` / `designTwinEngine.ts`. The AI endpoints accept and return prose and images only.
2. **Prices are stripped from narratives.** If the model states a price, the sanitiser replaces it with "as per the approved estimate" and the response is flagged (`narrativeSanitised: true`) so the UI says so.
3. **Extracted dimensions are clamped.** A read outside 3-80 ft (7-20 ft ceiling) is clamped and pushed into `confidenceNotes`. Nothing is priced until a human confirms the room table in step 2.
4. **Approval is a permission, not a button.** Approving a concept, approving a package or handing a design to the twin requires ADMIN, PROJECT_MANAGER or `canApproveBOQ`; anyone else gets **403**.
5. **Approved designs are locked.** Regenerating a narrative or render on an approved concept returns **409**.
6. **Every AI call is audited.** `AI_FLOOR_PLAN_READ`, `AI_DESIGN_GENERATED`, `DESIGN_HANDED_TO_TWIN` are written to the audit log with the actor and the model.

## 4. When Gemini is unavailable

| Situation | Response | UI behaviour |
| --- | --- | --- |
| No key | `503 AI_NOT_CONFIGURED` | Chip reads "Gemini not configured"; AI buttons disabled with a tooltip |
| Key rejected / permission denied | `400` with `code: PERMISSION_DENIED` (non-retryable) | Error banner names the cause; deterministic path still works |
| Quota / rate limit | `502` with `code: RATE_LIMITED`, `retryable: true` | Error banner suggests retrying |
| Model returns no image | `502` with `code: NO_IMAGE` | Explains that `GEMINI_IMAGE_MODEL` needs an image-capable model |
| Narrative or renders all fail | `502 AI_EMPTY` with the per-item `failures` list | Nothing is stored; the concept keeps its previous content |

The studio is fully usable with no key: concepts, revisions, approval, BOQ and the twin are all deterministic.

## 5. Data handling

- The floor plan file is sent to Gemini when you press **Read plan with AI**, and is not stored on the server; only the extracted rooms and the provenance record (`aiExtraction`: engine, model, characters read, confidence notes) are saved.
- Renders come back as data URIs and are stored on the concept as assets with `source: AI_GENERATED`, `approvalStatus: PENDING` and the prompt reference, so they can be reviewed and approved like any other deliverable.
- Say this out loud before a client demo: pressing an AI button sends that drawing or room description to Google.

## 6. Verification

- `GET /api/ai/status` with no key → `configured: false`; with a key → `configured: true`.
- `POST /api/ai/studio/extract-plan` with no key → **503 AI_NOT_CONFIGURED** (not a crash, not a fake result).
- `POST …/ai-generate` with no key → **503 AI_NOT_CONFIGURED**.
- Client-role user calling approve → **403**.
- Live model calls were not exercised in the build environment (no key available there); the failure paths and the status contract were.
