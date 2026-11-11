# AI Floor Plan-to-Interior Design Studio — Architecture

Module code **M04-C**, tab key `design_studio`, Stage 2 (Survey & Design).

## Why this is not "upload a photo and ask an image AI"

A floor plan carries geometry. If a generated image ignores that geometry, the concept cannot be priced, cannot be approved room-wise and cannot become a BOQ. So the studio is built around **one structured model that every later step reads from**:

```
intake (PDF/JPG/PNG/DWG/DXF/dimensions)
   └─> FloorPlanModel            rooms, walls, openings, confidence, uncertainty list
        ├─> DesignPreferences    structured constraints (not a free-text prompt)
        ├─> DesignConcept[]      3-5 alternatives, each with RoomScheme[] (one per room)
        │     ├─> ConceptRevision[]   room-scoped or whole-concept, versioned
        │     └─> approval            locks every room scheme
        └─> BOQItem[]            quantity from the room, rate from the master library
```

Rules the engine enforces:

1. **No invented rooms.** A concept can only reference `model.rooms`.
2. **No silent guesses.** Anything inferred is pushed into `model.uncertainItems` and shown in step 2; the model must be confirmed before concepts, and confirmation is required before approval.
3. **Deterministic.** Same model + same preferences ⇒ same concepts, same numbers. No `Math.random()`, so a client presentation can be reproduced and audited.
4. **Money is derived.** Concept estimates come from the room schemes (quantity basis × rate). The BOQ re-uses the room geometry and matches each line to the Master Schedule of Rates; unmatched lines are marked `PROVISIONAL`, never faked as approved.
5. **Every artefact keeps its references.** BOQ lines carry `roomZone`, `floor`, the concept code and version in `sourceDocumentRef`.

## Files

| File | Role |
| --- | --- |
| `src/types/designStudio.ts` | Shared contract: `FloorPlanModel`, `DesignPreferences`, `DesignConcept`, `RoomScheme`, `ConceptRevision`, `DesignStudioSession` |
| `src/server/designStudioEngine.ts` | `buildFloorPlanModel`, `generateConcepts`, `applyConceptRevision`, `generateBOQFromConcept`, `costOfSchemes`, `logPrompt` |
| `src/data/villa253DesignStudio.ts` | Seeded Villa 253 session (7 rooms from the R0 DXF, 4 concepts, 1 revision, approval, 39-line BOQ) |
| `src/components/designStudio/AIDesignStudioView.tsx` | Six-step UI + print-ready client presentation |
| `src/server/db.ts` | `designStudioSessions` map, `getDesignStudioSession`, `saveDesignStudioSession`, `appendBOQRevision` |
| `server.ts` | REST surface below |

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/design-studio/:projectId` | Session (creates an empty one if absent) |
| POST | `/api/design-studio/:projectId/floor-plan` | Intake + analysis → `FloorPlanModel` (flags uncertainties) |
| PUT | `/api/design-studio/:projectId/model` | Confirm/correct dimensions; recomputes area, perimeter, wall area; clears flags |
| PUT | `/api/design-studio/:projectId/preferences` | Validated preference form |
| POST | `/api/design-studio/:projectId/generate` | 3-5 concepts (`count` 3…5) from the confirmed model |
| POST | `/api/design-studio/:projectId/concepts/:id/revision` | Room-scoped or whole-concept revision; bumps version and re-costs |
| POST | `/api/design-studio/:projectId/concepts/:id/select` | Mark the preferred concept |
| POST | `/api/design-studio/:projectId/concepts/:id/approve` | Approve + lock all room schemes (requires confirmed model) |
| POST | `/api/design-studio/:projectId/concepts/:id/reject` | Reject a concept |
| POST | `/api/design-studio/:projectId/generate-boq` | Approved concept → room-wise BOQ; `applyToProject: true` also appends a project revision |
| GET | `/api/design-studio/:projectId/presentation` | Presentation pack: model, preferences, concept, alternatives, BOQ summary, prompt history |

All routes are behind the existing session auth (`erp_session` cookie); `approve` and `generate-boq` log to the audit trail.

### Example: intake

```json
POST /api/design-studio/PROJ-VILLA-253/floor-plan
{
  "kind": "DXF",
  "fileName": "Villa253_FloorPlan_Editable_R0.dxf",
  "scaleRatio": "1:100",
  "rooms": [
    { "name": "Living & Dining", "lengthFt": 25.33, "widthFt": 19, "ceilingHeightFt": 10.25,
      "openings": [{ "code": "SD1", "type": "SLIDER", "widthFt": 27, "heightFt": 10.25, "wall": "NORTH" }] }
  ]
}
```

## Generation model

Each concept = a **style template** (palette, material voice, furniture/lighting language, cost factor) applied to **every room** through a room-type resolver:

| Room type | Flooring | Joinery | Ceiling | MEP |
| --- | --- | --- | --- | --- |
| Living / Dining / Study | preference (marble/tile/oak/vinyl) | TV console + crockery (r.ft) | gypsum + cove | AC, electrical points |
| Master / Bedroom / Kids | preference | wardrobe elevation (sq.ft) | gypsum + cove | AC, electrical |
| Kitchen | anti-skid tile | modular kitchen (r.ft) | gypsum | plumbing, AC |
| Bathroom / Powder / Utility | anti-skid tile | — | gypsum | plumbing |
| Balcony / Deck / Gazebo | hardwood deck | gazebo structure | open / pergola | outdoor electrical |

Quantity bases (`FLOOR_AREA`, `WALL_CEILING_AREA`, `CEILING_AREA`, `WARDROBE_ELEVATION`, `RUNNING_FT_KITCHEN`, `RUNNING_FT_LIVING`, `POINTS`, `LUMPSUM`, `ONE_PER_ROOM`) are what turn a design into a measurable BOQ line.

Revision types: `COLOUR_ONLY` (palette + paint spec, furniture untouched), `FLOORING_SWAP`, `SOFA_SWAP`, `MATERIAL_SWAP`, `LAYOUT_CHANGE`, `BUDGET_VARIANT` (±15% on the same design), `OTHER` (note recorded). Every revision stores who asked, the scope (room or whole), the resolved summary and the resulting version.

## Extending it

- **Real OCR / CV:** already wired through Puter.js — see `docs/PUTER_AI_INTEGRATION.md` (`extractRoomsFromFloorPlan`). To swap providers, replace the body of `POST /floor-plan` — call your vision service, map its output to `RawRoomInput[]`, then keep `buildFloorPlanModel` as-is. Everything downstream keeps working.
- **Richer image generation:** `DesignConcept.imagePromptUsed` already holds a geometry-aware prompt; pass it to your image model and store the returned URL on `RoomScheme.renderImageUrl`.
- **3D / BIM:** the room model is a plain list of dimensioned rectangles with openings — enough to emit IFC spaces or a three.js scene without touching the pricing path.
- **Persona variants, multi-view consistency, before/after:** all are additive on the same `DesignConcept` (extra `roomSchemes`, extra `moodBoard` entries); the BOQ engine only reads `materials`.
