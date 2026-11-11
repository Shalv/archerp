# Project Design Digital Twin

Module **M04-D**, tab key `design_twin`, Stage 2.

A structured, version-controlled representation of the actual property. AI and the drawing tools read from it; nothing enters a drawing package that is not in it. This is the difference between a design-to-execution platform and an image gallery.

```
PROJECT  PROJ-VILLA-253
└── FLOOR PLAN      Villa253_FloorPlan_Editable_R0.dxf  (confirmed 30-05-2026)
    └── FLOOR       FLR-01 Ground · FLR-02 First · FLR-03 Roof
        └── ROOM    MBR-002 Master Bedroom 1 Suite
            ├── requirements / brief / concept  (REQ-V253-001, OPT-01-LUXURY v2)
            ├── WALL_A  MBR-002-WA   NORTH
            │    ├── wall elevation      AST-MBR-002-WA-E01-R03   WE-MBR-002-N
            │    ├── 3D render           AST-MBR-002-RD-001       RD-MBR-002 (parent)
            │    ├── reference image     AST-MBR-002-WA-U01
            │    ├── mood board          AST-MBR-002-WA-B01-R03   MB-MBR-002-N
            │    ├── material specs      MAT-MBR-002-WA-R03 (Natural Oak Veneer)
            │    ├── dimensions          14.00' × 19.00' × 10.25' (verified)
            │    ├── construction detail AST-MBR-002-WA-D01-R03   CD-MBR-002-WA
            │    └── BOQ items           PNT-01, CIV-01
            ├── WALL_B / WALL_C / WALL_D
            ├── CEILING · FLOORING · DOORS_WINDOWS
            └── ELECTRICAL · LIGHTING · FURNITURE_JOINERY · PLUMBING_HVAC
```

## Why every ID exists

| ID form | Meaning | Example |
| --- | --- | --- |
| `MBR-002` | room inside this project | Master Bedroom 1 Suite |
| `MBR-002-WA` | element inside the room | Wall A (north) |
| `MAT-MBR-002-WA-R03` | material record, room + element scoped | Natural Oak Veneer |
| `AST-MBR-002-WA-E01-R03` | asset, room + element + type + revision | Wall elevation |
| `WE-MBR-002-N` | drawing reference an engineer would cite | Wall elevation, north |
| `PROMPT-MBR-002-RD-01` | prompt record behind a generated asset | render prompt |
| `REV-MBR-002-WA-R03` | revision that touched this element | oak change |

## Where the twin comes from

`buildDesignTwin()` takes **three approved inputs only**:

1. a **confirmed floor plan model** (`confirmedAt` set — unverified geometry cannot produce a drawing),
2. an **approved design concept** (room schemes, palette, materials),
3. the **room-wise BOQ** (rates and item codes).

From those it derives rooms, the eleven element kinds per room, material records (BOQ lines first, so every finish has a rate and an item code), and every asset. Nothing is typed in by hand, and a room with no approved scheme cannot enter the twin at all.

Whole-villa BOQ lines (paint `PNT-01`, glazing `DOR-01`) are **allocated to rooms by wall + ceiling area share**, never duplicated — otherwise changing one wall would re-price the whole villa.

## The ten mandatory relationships

`validateDesignPackage()` computes these from records, not from prose:

| Check | What it proves |
| --- | --- |
| `GEOMETRY_VERIFIED` | every room traces to the confirmed plan; no drawing from an estimate |
| `WALL_ELEVATIONS_MAPPED` | each enclosed room has Wall A–D with a derived elevation in the current revision |
| `RENDERS_MATCH_APPROVED_DESIGN` | every room has an **approved** render pinned to the current design version |
| `MOOD_BOARDS_MATCH_MATERIALS` | every board's material IDs belong to that wall's specification |
| `MATERIAL_IMAGES_MATCH_IDS` | every swatch resolves to a material record |
| `FURNITURE_DIMENSIONS_VALIDATED` | joinery fits the verified room and ceiling height, with a furniture list |
| `LIGHTING_ELECTRICAL_COORDINATED` | lighting and electrical share circuit references in every room |
| `DETAILS_REFERENCE_CORRECT_WALL` | each detail is parented to its element and carries only that element's materials |
| `BOQ_LINKS_APPROVED_SPECS` | every finish element has approved materials **and** at least one BOQ line |
| `SINGLE_DESIGN_REVISION` | every active asset is stamped with the current design version |

Any failure keeps the package at `VALIDATION_FAILED` or `AWAITING_APPROVAL`. `publishDesignPackage()` is the only release path and returns the blocking reasons — it is not possible to mark a package execution-ready by clicking a status dropdown.

## Visual assets are derived, not fetched

There is no stock-photo step anywhere. Every visual is drawn from a record:

- **wall elevation** — SVG from the verified wall length × ceiling height, labelled with the wall, its material and `VERIFIED / UNVERIFIED`;
- **dimension sheet** — SVG plan with the room's L × W, area, perimeter and source room ID;
- **material reference** — SVG swatch of the material record (name, brand, finish, `MAT-` id);
- **mood board** — SVG composed only from that element's material IDs and the approved palette;
- **construction detail** — SVG build-up in layer sequence from the element's materials;
- **lighting / electrical / plumbing plan** — SVG point layout from the room geometry and circuit references;
- **3D render** — the project's own approved render asset (or a Puter render), recorded as `PROJECT_LIBRARY` / `AI_GENERATED` with its prompt reference.

Because they are generated from records, a swatch or elevation can never depict a material that is not in the specification.

## Asset metadata

Every asset record carries the fields the spec requires, and the UI shows them in the asset drawer:

`Asset ID · Project ID · Room ID · Element ID · Asset type · Design version · Drawing reference · Material references · Source · Prompt reference · Approval status · Parent asset · Revision · Supersedes · Status · Provenance (origin, source URL, licence, method, model, generated by, generated at) · Geometry basis (dimensions + verified flag + source ref)`.

`POST /assets` refuses an upload without provenance, and refuses a material reference that is not in the project's register. Manufacturer assets additionally require a source URL and licence.

## Revision behaviour

A change is an explicit, scoped operation (`PUT /elements/:id/change`):

1. only the material being changed is replaced — other finishes on the same element stay as approved;
2. the new material becomes its own record with the new revision in its ID;
3. **only that element's assets** are regenerated (new revision, `PENDING`, `supersedes` the old id); the old assets become `SUPERSEDED` and remain in history;
4. the room render is set back to `PENDING` because the specification changed;
5. dependent elements (electrical, lighting, joinery for a wall) get `NEEDS_REVIEW` flags;
6. the linked BOQ line is re-priced from the material's quantity × rate and the delta is recorded;
7. the design version bumps, `validation` is cleared and the package returns to `AWAITING_APPROVAL`.

Unrelated walls, rooms and assets are untouched.

The seeded example is exactly the client request in the brief: Master Wall A **walnut → natural oak** (`REV-MBR-002-WA-R03`, −₹98,832 on `PNT-01`), with the earlier emulsion → walnut revision still in history and its superseded assets intact.

**Releasing after a change:** approve the element revision → **re-issue** the package (stamps every active asset with the new version so the set is one revision again) → validate → approve the package → release. Every step is an API call and an audit entry.

## API

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/design-twin/:projectId` | the twin (404 `TWIN_NOT_BUILT` if none) |
| GET | `/api/design-twin/:projectId/materials` | project materials + approved finish library |
| POST | `/api/design-twin/:projectId/build` | build from the approved concept (`force: true` rebuilds) |
| POST | `/api/design-twin/:projectId/validate` | run the ten checks, persist the report |
| PUT | `/api/design-twin/:projectId/elements/:elementId/change` | scoped revision (requires a reason ≥ 8 chars) |
| POST | `/api/design-twin/:projectId/elements/:elementId/approve` | approve the regenerated assets |
| POST | `/api/design-twin/:projectId/reissue` | stamp the whole set to the current version |
| POST | `/api/design-twin/:projectId/approve-package` | package sign-off (409 if validation fails) |
| POST | `/api/design-twin/:projectId/publish` | release gate; 409 with reasons when blocked |
| POST | `/api/design-twin/:projectId/assets` | attach an uploaded / manufacturer / AI asset with provenance |

## Files

| File | Role |
| --- | --- |
| `src/types/designTwin.ts` | the registry contract (rooms, elements, materials, assets, revisions, validation) |
| `src/server/designTwinEngine.ts` | build, derive assets, validate, revise, re-issue, approve, publish |
| `src/data/villa253DesignTwin.ts` | seeded Villa 253 twin + approved finish library |
| `src/components/designTwin/DesignTwinView.tsx` | property tree, element package, validation gate, revision flow, asset drawer |
| `src/server/db.ts` | `designTwins` store |
| `server.ts` | the ten routes above |

## Verification performed

- `npx tsc --noEmit` clean; `server.ts` bundles.
- Seed probe: 7 rooms, 71 elements, 391 assets, 79 material records, 7 prompt records, 3 revisions, **10/10 checks**, `APPROVED_FOR_EXECUTION`.
- HTTP gate test: change Wall A → `AWAITING_APPROVAL`, publish **409** with the failing checks; validate **8/10** (`RENDERS_MATCH_APPROVED_DESIGN`, `SINGLE_DESIGN_REVISION`); approve element → 0 pending; re-issue → **10/10**; approve package → `APPROVED_FOR_EXECUTION`; publish → **200 ok**.
- Guard rails: asset without provenance **400**, asset with an unknown material ID **400**, change without a reason **400**, rebuild over an existing twin **409**.
- BOQ delta on the walnut → oak change: **+₹98,832** on `PNT-01`, computed from the allocated wall quantity × rate difference.

## Honest limits

- The visual assets are schematic SVGs, not photoreal renders or certified CAD. The 3D render is the project's approved render (or a Puter-generated one), and the elevation is a measured diagram, not an AutoCAD sheet.
- Wall A–D map to north/east/south/west of the room; a room with an irregular plan still uses four bounding walls. That is enough for finishes and BOQ, not for a construction issue set.
- `SINGLE_DESIGN_REVISION` intentionally blocks a partial re-issue: after any element change the whole set must be stamped again. That is the professional behaviour, and it is why the re-issue step exists.
- `vite build` was not run in this environment (bundler OOM on a 2 GB pod).
