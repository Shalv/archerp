# Audit — M04-C AI Floor Plan → Interior Design Studio

**Scope:** the design studio module (intake → analysis → preferences → concepts → selection → BOQ) and its handover into M04-D.
**Method:** read every route, engine path and UI state; compare against how a design studio actually runs a job (brief → measured survey → concept → client sign-off → design freeze → technical package → priced BOQ); then test the failure paths over HTTP.
**Result:** 9 findings fixed in this pass, 8 open and listed below rather than hidden.

## 1. Process conformance

| Industry step | What the module does | Verdict |
| --- | --- | --- |
| Brief capture | structured preference form + room-level instructions | conforms |
| Measured survey | floor plan intake (PDF/JPEG/PNG/DXF/DWG or typed), per-room confidence, uncertainty list, explicit confirmation gate | conforms — and refuses to draw from an unverified dimension |
| Concept design | 3-5 room-wise concepts from one model, each with palette, materials, furniture, lighting, cost band | conforms |
| Client review | side-by-side comparison, comments, room-scoped or whole-concept revisions, versioning | conforms |
| Design sign-off | approval locks every room scheme; approval is a role permission; recorded with actor + timestamp | conforms (after F2) |
| Design freeze | handover to the Project Design Digital Twin as the frozen record | conforms (after F5) |
| Priced BOQ | room-wise takeoff from the confirmed model + Master Schedule of Rates | conforms |
| Technical package | twin elevations, details, dimension sheets, validation gate | in M04-D, linked |
| Client presentation | print-ready pack from the approved concept | conforms (print, not a stored PDF — O3) |

## 2. Findings

| ID | Area | Severity | Finding | Status |
| --- | --- | --- | --- | --- |
| F1 | Security / architecture | High | AI ran through a browser SDK with a user-paid account; no key control, a third-party script in the page, and no server-side audit of what was sent. | **Fixed** — server-side Gemini, key in the environment only, SDK script removed |
| F2 | Governance | High | Any signed-in user (including the CLIENT role) could approve a design, which then fed the BOQ and the drawing package. | **Fixed** — `requireApprover`: ADMIN / PROJECT_MANAGER / `canApproveBOQ`, otherwise 403 |
| F3 | Data integrity | High | Two designers editing the same session silently overwrote each other (last write won) on preferences and concept generation. | **Fixed** — `expectedUpdatedAt` check, 409 `STALE_SESSION` |
| F4 | Data integrity | Medium | Preferences accepted a zero carpet area, and a CUSTOM budget band with no amount — both then priced a concept at ₹0. | **Fixed** — 400 with a specific message for each |
| F5 | Process | High | Nothing connected the approved concept to the design twin; the twin could only be built from a separate route, so the two modules could drift. | **Fixed** — `POST …/handoff-to-twin` + "Hand off to design twin" button; requires approval + BOQ |
| F6 | Commercial risk | Medium | A generated narrative could state a price, which a client would read as a quote. | **Fixed** — narrative sanitiser strips currency, flags the response, UI reports it |
| F7 | Operability | Medium | The UI had no way to tell whether AI was configured; buttons either failed or pretended. | **Fixed** — `GET /api/ai/status` + header chip driven by the server |
| F8 | Data integrity | Medium | A vision read could return an implausible dimension (e.g. 400 ft) which would then drive quantities. | **Fixed** — values clamped to 3-80 ft / 7-20 ft and pushed into `confidenceNotes` |
| F9 | Audit | Medium | AI activity and handovers were not recorded in the audit trail. | **Fixed** — `AI_FLOOR_PLAN_READ`, `AI_DESIGN_GENERATED`, `DESIGN_HANDED_TO_TWIN` |
| O1 | Documents | Medium | The uploaded plan is not retained as a project document — only the extracted rooms and provenance are stored. | Open |
| O2 | Sign-off | Medium | Approval is at concept level; there is no per-room sign-off, so one disputed room re-opens the whole concept. | Open |
| O3 | Deliverables | Medium | The client presentation opens a print view; there is no stored, versioned PDF in the document register. | Open |
| O4 | Commercial | Medium | No budget guardrail at concept stage — a concept can sit 40% above the client's band with no warning until the BOQ exists. | Open |
| O5 | Client workflow | Medium | Client approval is captured verbally and recorded by staff; there is no portal-side approve action with its own audit entry. | Open |
| O6 | Resilience | Low | Render generation depends on one image model; no fallback provider or retry policy beyond the manual button. | Open |
| O7 | Cost control | Low | No per-user quota or rate limit on AI endpoints beyond whatever Google enforces. | Open |
| O8 | Quality | Low | No automated test suite in the repo; verification is by typecheck, engine probes and HTTP scripts. | Open |

## 3. What changed in this pass

- `src/server/geminiStudioService.ts` — Gemini vision, narrative and render calls, with typed errors, a timeout, a narrative sanitiser and dimension clamping.
- `server.ts` — `/api/ai/status`, `/api/ai/studio/extract-plan`, `/concepts/:cid/ai-generate`, `/handoff-to-twin`; `requireApprover` on approve/handover; validation and stale-session guards on preferences and generation; 503 `AI_NOT_CONFIGURED` when the key is absent.
- `src/components/designStudio/AIDesignStudioView.tsx` — Gemini status chip, "Read plan with AI", "Renders + narrative", handoff button, progress and failure reporting; all Puter code removed.
- Removed: `src/services/puterAI.ts`, the Puter script tag, the footer credit, `docs/PUTER_AI_INTEGRATION.md`.
- Docs: `docs/GEMINI_AI.md` (setup, guards, failure matrix), this audit, runbook updated.

## 4. Verified after the change

| Test | Result |
| --- | --- |
| `GET /api/ai/status` without a key | 200, `configured: false`, model named |
| `POST /api/ai/studio/extract-plan` without a key | **503 AI_NOT_CONFIGURED** |
| `POST …/ai-generate` without a key | **503 AI_NOT_CONFIGURED** |
| Preferences with zero carpet area | 400 "Carpet area must be a positive number" |
| CUSTOM budget band without an amount | 400 "A custom budget band needs the client budget amount" |
| Preferences with a stale `expectedUpdatedAt` | 409 `STALE_SESSION` |
| Handover to twin (approved concept + BOQ) | 200, twin built with 7 rooms / 383 assets |
| CLIENT role calling approve | **403** |
| `tsc --noEmit` / `esbuild server.ts` | clean |

## 5. Recommended next

1. **O4 budget guardrail** first — it is the finding most likely to embarrass a live pitch. A concept whose estimate is more than 15% outside the client band should be flagged in the comparison table.
2. **O2 per-room sign-off** — it is the difference between a concept approval and a design freeze room by room.
3. **O3 stored presentation PDF** — write the pack into the document register so the client receives a versioned file, not a print dialog.
4. **O8 test suite** — the engine and route invariants are already covered by scripts; move them into the repo as `npm test` so they survive the next refactor.
