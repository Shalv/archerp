# Villa 253 Demo Runbook + AI Design Studio
### Build Storys ERP — demo dataset and the new AI Floor Plan-to-Interior Design Studio

This bundle does two things:

1. **Replaces the scattered demo data** (Skyline apartment, Gurugram/Mumbai mix, villa images on apartment rooms) with **one coherent project** — *Villa 253, 24-Type North-Facing 3BHK with Roof Gazebo, Karjat* — carried through every module from enquiry to warranty. Every quantity traces back to the R0 wall-marking drawing `VILLA_253_WALL_MARKING_10_10_24_REV0.pdf` (dated 10-10-24).
2. **Adds the AI Floor Plan-to-Interior Design Studio (M04-C)** — upload plan → AI analysis → structured preferences → 3-5 room-wise concepts → revisions → approval → room-wise BOQ.

Nothing in the demo is random. Money is computed from quantity × rate, dates follow one contract programme, and every record belongs to `PROJ-VILLA-253`.

---

## 1. Install the bundle

Copy these files into your repo, keeping the paths:

```
src/data/villa253DemoProject.ts          NEW  project record, 7 rooms, BOQ rev0/rev1, quotation
src/data/villa253DemoSeeds.ts            NEW  CRM, drawings, procurement, subcontract, DPR, quality, handover
src/data/villa253OpsSeeds.ts             NEW  resources, timesheets, deployments, tasks, cost traceability
src/data/villa253Registers.ts            NEW  contracts, variations, billing, finance, portal, documents, assets
src/data/villa253DesignStudio.ts         NEW  seeded AI Design Studio session for Villa 253
src/types/designStudio.ts                NEW  studio types
src/server/designStudioEngine.ts         NEW  geometry-preserving generation engine
src/components/designStudio/AIDesignStudioView.tsx  NEW  the studio UI (6-step workflow)
src/server/geminiStudioService.ts        NEW  Gemini vision / narrative / render service (server-side, GEMINI_API_KEY)
src/types/designTwin.ts                  NEW  design-twin registry contract (rooms, elements, assets, revisions)
src/server/designTwinEngine.ts           NEW  build / validate / revise / re-issue / approve / publish engine
src/data/villa253DesignTwin.ts           NEW  seeded Villa 253 twin + approved finish library
src/components/designTwin/DesignTwinView.tsx  NEW  property tree, element package, validation gate, asset drawer
docs/DESIGN_TWIN.md                      NEW  traceability architecture, IDs, ten checks, revision behaviour
index.html                               MODIFIED  loads https://js.puter.com/v2/
docs/GEMINI_AI.md                        NEW  Gemini setup, models, guards and failure behaviour
docs/M04C_AUDIT.md                       NEW  audit of the AI Design Studio module against the studio process

src/data/crmSeedData.ts                  REPLACED  re-exports the Villa 253 pipeline
src/data/costTraceabilityData.ts         REPLACED  ledger derived from the Rev 1 BOQ
src/data/timesheetAndResourceSeed.ts     REPLACED  villa timesheets / deployments / tasks
src/server/mockFoundationData.ts         REPLACED  customers + vendors for Villa 253
src/server/db.ts                         MODIFIED  seeds Villa 253 + registers + studio, 10 users, audit trail
src/server/syntheticDemo.ts              MODIFIED (title string only; no longer used for seeding)
server.ts                                MODIFIED  11 design-studio API routes + BOQ revision append
src/App.tsx                              MODIFIED  renders the studio on the design_studio tab
src/components/TopMenuBar.tsx            MODIFIED  M04-C entry in Stage 2
src/data/modulesRegistry.ts              MODIFIED  M04-C module metadata
src/services/timesheetService.ts         MODIFIED  storage keys bumped to v2 (stale local data ignored)
src/components/{DesignAndDrawings,ProcurementAndInventory,SubcontractorAndMeasurementBook,
  SiteExecutionAndDPR,QualityAndSafety,HandoverAndWarranty}View.tsx  MODIFIED  wired to the dataset
src/components/SiteSurveyWorkspace.tsx   MODIFIED  villa constraints, R0 attachments, villa rooms
src/components/floorplan/FloorPlanReferenceGallery.tsx  MODIFIED  prop drift fixed (currentRoom/activeImageUrl)
src/components/{ProjectManagementHub,RoleCenterDashboard,UserMasterSetup}View.tsx  MODIFIED  villa labels
src/data/{defaultUsers,floorplanSpatialData,agenticAISuggestions}.ts  MODIFIED  project id → PROJ-VILLA-253
src/data/discoveryAndSampleHeadsData.ts  MODIFIED  villa site location
data/buildstorys_db.json                 REPLACED  pre-seeded database (loads instantly, no reset needed)
docs/VILLA_253_DEMO_RUNBOOK.md           NEW  this file
docs/AI_DESIGN_STUDIO.md                 NEW  architecture + API reference
```

```bash
npm install
npm run dev            # http://localhost:3000
```

The app reads `data/buildstorys_db.json`. If you ever want a clean state:
`POST /api/system/reset-demo` as an admin (or delete the file and restart).
Use a fresh browser profile or clear `localStorage` — the studio, discovery and timesheet screens cache per project.

**Login:** `shruthi` / `demo` (Design Director, full access) · `rajesh.qs` / `Estimator@123` · `aarav.admin` / `Admin@123`

---

## 2. The one project every module shares

| Fact | Value |
| --- | --- |
| Project | `PROJ-VILLA-253` · `BS-2026-V253` |
| Client | Mr. Aditya & Mrs. Sneha Kulkarni (Kulkarni Precision Tools) |
| Site | Villa 253, 24-Type, The Meadows (Phase 2), Neral–Karjat Road, Karjat 410201 |
| Scope | Turnkey interiors on a developer bare shell |
| Areas | Plot 4,800 · Built-up 3,150 · Carpet 2,204.48 sq.ft (7 measured spaces) |
| Contract | ₹84,36,188.20 + GST 18% ₹15,18,513.88 = **₹99,54,702.08** |
| Programme | Enquiry 18-05-2026 → contract 01-07-2026 → mobilise 06-07-2026 → **handover 18-12-2026** |
| Today in the demo | 11-11-2026, execution at ~68%, snagging starts 27-11-2026 |

Rooms (exact R0 dimensions): Living 25'-4"×19'-0" (481 sq.ft) · Master 14'×19' (266) · Bedroom 2 18'-11"×19' (359) · Kitchen 14'-6"×9' (131) · Stair core 7'-6"×19' (143) · Bedroom 3 20'-8"×19' (393) · Roof Gazebo 24'×18' (432).

**BOQ:** 20 lines, 2 revisions — Rev 0 AI draft (3 missing-dimension alerts, 2 provisional rates) and Rev 1 frozen baseline. Milestones: 10/15/25/25/15/10% — first three **PAID**, joinery **INVOICED** (₹24,88,675.52), last two pending.

---

## 3. The 25-minute demo script

### Stage 1 — Enquiry (3 min)
**CRM & Lead Funnel** (`crm`): 5 leads. Open **LD-V253 Kulkarni** — WON, deal value ₹99,54,702, BANT scored, 5-entry communication log ending in the contract signing. Point out the AI snippet: marble/teak 18-day import lead time, terrace cracks before gazebo base plates.
**Customers & Contacts** (`contacts`): CUST-1001 Kulkarni (GSTIN 27AAKPK7719R1ZM), plus the Bhandari / Iyer / Deshpande pipeline.

### Stage 2 — Survey & design (6 min) ← the new product experience
**Site Survey** (`survey`): 7 villa rooms, north-facing constraints, R0 PDF + editable DXF + laser survey attachments, "no lift — material moves via the 7'-6" dogleg stair".
**AI Floor Plan-to-Design Studio** (`design_studio`, Stage 2 → M04-C): the headline demo. See section 4.
**Drawings** (`drawings`): 9 sheets, all Villa 253 — `V253-ARC-101-R0` (the actual R0 wall marking, GFC stamped), furniture layout R2, joinery R2, kitchen R1, gazebo Section BB' R1, electrical SLD R2, 3D render set R4. Each thumbnail is a real villa asset.
**Materials** (`materials`): discovery brief + sample heads carried from the same brief.

### Stage 2b — Project Design Digital Twin (6 min) — the traceability demo
Open **Stage 2 → Project Design Digital Twin** (`design_twin`, M04-D). This is the registry behind every drawing.

- Left: the property tree — 3 floors, 7 rooms, 71 elements, each with a status dot. Pick **Master Bedroom 1 Suite → Wall A**.
- Centre: the element package. Dimensions (14' × 19' × 10.25', verified), the approved palette, the material record by ID (`MAT-MBR-002-WA-R03` Natural Oak Veneer, ₹845/sq.ft, allocated qty 681.6 sq.ft of `PNT-01`), construction notes, the BOQ lines (`PNT-01`, `CIV-01`) and **eight linked deliverables** — wall elevation, mood board, two material references (one from the manufacturer), construction detail, specification, BOQ link, plus the parent room render.
- Click any thumbnail: the drawer shows the full metadata the brief asks for — asset ID, project/room/element, type, design version, drawing reference, material references, source, prompt reference, approval, parent asset, revision, supersedes, provenance (origin, source URL, licence, method, model) and the geometry basis with its verified flag.
- Right: **Package validation 10/10** at V1.2, the release gate (validation passed · package approved · no pending assets) and the revision history — including the client's walnut → natural oak change with its −₹98,832 BOQ impact.
- Now break it live: **Change** on Wall A → switch to *American Walnut Veneer* → reason "client wants walnut for the winter scheme". The revision regenerates **only** that wall's assets (9), supersedes the previous 8, flags 3 dependent elements, re-prices the BOQ line and drops the package to *awaiting approval*.
- Press **Release** → **blocked**, with the exact failing checks. Press **Validate** → 8/10 (`RENDERS_MATCH_APPROVED_DESIGN`, `SINGLE_DESIGN_REVISION`). **Approve revision** → 0 pending. **Re-issue** → the whole set is stamped V1.3. **Validate** → 10/10. **Approve package** → **Release** → 200.
- Try the guard rails: an asset without provenance is refused (400), a material ID that is not in the register is refused (400), a change without a reason is refused (400).

### Stage 3 — Estimation (5 min)
**BOQ** (`boq`): 20 lines, room-wise quantities with formulas (`25.33 × 19 = 481 sq.ft`), wastage, markup. Show `WTR-01` (1,653.2 sq.ft of wet-area waterproofing) and `CLG-02` (gazebo pergola, 432 sq.ft, 27% markup).
**Budget** (`budget`): deterministic engine — 2.5% logistics, 5% site overheads, 3% contingency, 18% GST.
**Cost traceability** (`traceability`): 20 rows derived from the same BOQ — budget ₹68,17,482.83, committed ₹51,82,885, incurred ₹51,29,738, no overruns.
**Quotation** (`quotation`): `BS-QT-2026-0253`, ACCEPTED, 6 milestones reconciling to ₹99,54,702.08.

### Stage 4 — Contracts & variations (2 min)
`contracts` (4: main + 3 subcontracts), `variations` (VO-01 outdoor kitchen ₹1,84,500 approved, VO-02 Statuario upgrade ₹96,200, VO-03 gazebo keypads ₹42,800 pending).

### Stage 5 — Execution (5 min)
**Schedule** (`schedule`): 12 WBS tasks, 68% overall, gazebo flagged **DELAYED +4 days** on the teak rafter delivery.
**Site execution / DPR** (`site_execution`): 5 DPRs 30-10 → 10-11 with labour counts, photos, petty expenses.
**Procurement** (`procurement`): 4 requisitions, 3 RFQs with vendor comparison (Konkan Timber ₹3,140/sheet vs Raigad ₹3,280), 6 POs, 5 GRNs (2 ply sheets rejected for delamination).
**Inventory** (`inventory`): 8 stock lines with reorder flags (Dr. Fixit REORDER_TRIGGERED).
**Subcontractors & MB** (`contractors`): 5 partners, 5 work orders, 9 measurement-book pages — e.g. 242.5 sq.ft of wardrobe elevation certified at ₹242/sq.ft = ₹58,685.
**Quality & safety** (`snags` tab → Quality): 4 NCRs (one open: kitchen shutter gaps 4mm vs 2.5mm), 4 permits to work (gazebo hot work active today), 5 tests (72-hour ponding passed).
**Timesheets / Resources** (`timesheets`, `resources`): 14 timesheet entries for week W45, 8 deployments on 10-11, 12 Kanban tasks.

### Stage 6 — Billing & finance (2 min)
`billing`: RA-01…RA-03 paid, RA-04 (₹24,88,675.52) pending approval with advance adjustment.
`finance`: 6 vouchers including 5% retention provision ₹1,95,600.

### Stage 7 — Handover (2 min)
`handover`: 8 snags (3 rectified, 5 open, targets to 20-11), `warranty`: 3 DLP tickets (2 closed with client rating, 1 technician dispatched for the gazebo creak).

Close on **Role Center** (`dashboard`) and the **Audit Logs** modal — 10 entries telling the same story from lead capture to today's DPR.

---

## 4. Demoing the AI Design Studio (M04-C)

Open **Stage 2 → AI Floor Plan-to-Design Studio**. The seeded session for Villa 253 is already complete (4 concepts, Concept A approved at v2, 39-line BOQ). Walk the six steps in the stepper:

1. **Floor plan** — six intake modes (PDF/JPG/PNG/DWG/DXF/enter dimensions). For a live demo choose *enter dimensions* and type three rooms, or upload any plan; with the Villa project the measured rooms are picked up automatically.
2. **AI analysis** — rooms, doors, windows/sliders, columns, circulation, per-room confidence (`CAD EXTRACTED` / `AI INFERRED` / `USER VERIFIED`) and an explicit **uncertainty list**. Nothing is silently guessed: a missing ceiling height, a square-room assumption or an area/dimension mismatch is printed and must be confirmed before pricing.
3. **Preferences** — the structured form from the brief: property type, area, style, budget band, palette, flooring, furniture, kitchen layout, lighting, storage, special requirements (Vastu / elderly / children / pets / accessibility) and **room-specific instructions**.
4. **Concepts** — 3-5 alternatives generated **from the same room model**, each with palette, room-wise materials, furniture, lighting, mood board and an estimate. The budget spread is real because each style carries its own cost factor.
5. **Select & approve** — side-by-side comparison, per-concept revisions (colour only / flooring swap / sofa swap / material swap / layout / budget variant), and approval, which **locks every room scheme**.
6. **Design → BOQ** — the approved concept becomes a **room-wise BOQ**: quantity from the measured room, rate from the Master Schedule of Rates where a matching trade + unit exists (otherwise flagged *Provisional*). 39 lines, ₹33,08,618.70 before GST for the seeded session.

Also demo: **Client presentation** (top-right) opens a print-ready pack — hero view, room-wise schemes with palettes and specifications, alternatives table, preliminary BOQ and the "visual concept, not an execution drawing" disclaimer. The **prompt & approval history** at the bottom of step 6 is the audit trail the brief asks for (prompt, engine, actor, timestamp, output).

### AI with Gemini (server-side)

Set `GEMINI_API_KEY` in the environment and restart. The studio header shows **Gemini · gemini-2.5-flash** or **Gemini not configured**; the key never reaches the browser and no third-party SDK is loaded.

- **Step 1 → "Read plan with AI"**: the file is posted to `POST /api/ai/studio/extract-plan`, where Gemini vision returns rooms in feet with a `confidenceNotes` list. Dimensions outside a plausible range are clamped and flagged, and nothing is priced until you confirm the room table in step 2.
- **Step 4/5 → "AI" / "Renders + narrative"**: `POST /api/design-studio/:id/concepts/:cid/ai-generate` writes the narrative and renders up to four room images with `gemini-2.5-flash-image`, then stores them on the concept with an audit entry.
- **Guards**: a narrative that contains a price has the price stripped and is flagged; AI never writes a quantity, rate or BOQ line; approved concepts are locked; only an admin or project manager can approve a design or release a package.
- **When it is unavailable** (no key, quota, permission denied): every button degrades to the deterministic engine and the chip says so.

Full guide: `docs/GEMINI_AI.md`. Audit findings: `docs/M04C_AUDIT.md`.

**Honest scope note for the demo:** without pressing an AI button, the analysis step is deterministic. It reads room geometry from the project's measured rooms, from dimensions the user types, or from the structured room list the CAD/image path supplies — it does not OCR an arbitrary photo on its own. If you upload an unseen plan, confirm the room table in step 2 before generating; that gate is deliberate, and it is also what makes the BOQ defensible. Wiring a real OCR/CV service or Gemini Vision into `POST /api/design-studio/:id/floor-plan` is a drop-in replacement — the model contract stays the same.

---

## 4a. Diagnosing a failing API call

Any API error in the studio now offers **Run server diagnostics** in the error banner. It calls
`GET /api/system/diagnostics` (signed in) and reports: build commit / node env / serverless flag, which
database file is loaded and its size, the project ids it contains, how many studio sessions and twins exist,
the Gemini status, the last ten server errors, and three pass/fail checks.

Reading the error text:

| Message | What it means | What to do |
| --- | --- | --- |
| `…returned HTML instead of JSON` / `HTTP 404` | `/api/*` is not routed to the app | the `vercel.json` rewrite is missing from that deployment — redeploy `main` |
| `HTTP 500` + `Host said: "FUNCTION_INVOCATION_FAILED"` | the API function crashed while starting | open diagnostics; if the database or a dependency is the cause it is listed there |
| `HTTP 503 AI_NOT_CONFIGURED` | no `GEMINI_API_KEY` on the server | set it and restart; everything else keeps working |
| `projects: PROJ-SKYLINE-1402` in diagnostics | the running database is the old demo file | it now self-migrates on boot; if it does not, `POST /api/system/reset-demo` as an admin |

A 500 with a non-JSON body is a **server-side crash**, not a routing problem — the route itself is fine
(`/api/design-studio/PROJ-SKYLINE-1402` returns 200 JSON locally, for any project id, even one that does not exist:
it creates an empty session).

## 4b. If the studio shows "…is not valid JSON"

That message means the request never reached the Express app — the host answered with its own HTML page.
Two causes, both fixed here:

1. **No API rewrite on Vercel.** `vercel.json` now maps `/api/:path*` → `/api/index?erpPath=:path*`, which is the
   entry point `api/index.ts` was written for. Without it every `/api/...` call 404s with an HTML page.
2. **A cryptic error instead of a real one.** All calls now go through `src/utils/apiClient.ts`, which checks the
   content type and raises one readable sentence naming the path, the status and the fix — never a JSON parse error.

If you still see it, the deployment is serving an older build: redeploy after merging.

**Stale demo data.** If the app shows `BS-2026-1402` / Skyline instead of Villa 253, the running database file predates
the new seed. `db.ts` now adds the studio, the twin and the registers to an existing file that already contains
`PROJ-VILLA-253` (additive only — nothing is deleted). If the file holds a different project entirely it logs a warning
and leaves your data alone; run `POST /api/system/reset-demo` as an admin, or delete `data/buildstorys_db.json` and restart.

## 4c. Every image and drawing in the demo

`src/data/villa253MediaLibrary.ts` is the single register of the project's own visuals — 15 items, each with the room it
depicts, its type, provenance and licence:

- **8 photographs/renders** — facade, great room (two views), master suite (two views), Bedroom 2, gazebo (two views)
- **3 CAD drawings** — the R0 wall-marking PDF, the editable 8-layer DXF, the vector plan preview
- **3 room plan sheets** — Bedroom 3, kitchen/utility, staircase core
- **1 site sketch** — massing and orientation from the 30-05-2026 visit

The studio shows the whole register in step 1, and a concept's room visuals now come from the room's own media instead of
a style template. The twin attaches every media item that shows a room as a `REFERENCE_IMAGE`/`DIMENSION_SHEET` asset, uses
the room's approved render as its `RENDER_3D`, and lists the five whole-villa drawings in a "Project drawings" strip.
Rooms with no project photograph (kitchen, staircase, Bedroom 3) get a **derived axonometric view** drawn from their verified
geometry and approved finishes, labelled as such — never a stock image.

## 5. What was fixed on the way

- `PROJ-SKYLINE-1402` → `PROJ-VILLA-253` everywhere (app default, users, seeds, D365 panes).
- Six journey views no longer carry their own hardcoded Skyline arrays; they import the Villa 253 dataset, so CRM → handover cannot drift apart again.
- `FloorPlanReferenceGallery` prop drift (`currentRoom`, `activeImageUrl`, `onApplyReferenceImage`, `isCompactCarousel`) fixed — `tsc --noEmit` is now clean (it had 2 errors before).
- Timesheet/deployment/task `localStorage` keys bumped to `_v2` so old demo data cannot mask the new seed.
- Audit log, user register (10 users incl. Meera Rao, Farhan Qureshi, K. R. Nair, Arun Pillai) and the client portal user all match the team named in the operational records.
- Empty registers (contracts, variations, billing, finance, portal, documents, assets) now carry real records instead of "no records yet".

## 6. Verification performed

- `npx tsc --noEmit` — clean.
- `npx esbuild server.ts --bundle` — clean.
- Engine probe — 7 rooms / 2,204.48 sq.ft; 20 BOQ lines; subtotal ₹84,36,188.20; milestone sum = ₹99,54,702.08.
- Cross-check probe — every GRN references an existing PO; every MB item code and traceability row exists in the BOQ; zero overruns.
- HTTP smoke test against the running server (login → upload plan → confirm → preferences → generate → revise → approve → BOQ → presentation): all 200s; a fresh 3-room plan produced 3 concepts (₹8L/₹10L/₹11L), a v2 revision, an approval and a 19-line BOQ at ₹11,92,083.55.
- `vite build` could **not** be run in this environment (the bundler ran out of memory on a 2 GB pod). Run `npm run build` locally as your final gate.
