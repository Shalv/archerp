# Villa 253 Wall Marking Drawing R0 — CAD Reconstruction & Room Image Logic Documentation

## 1. Authoritative Architectural Reference
This application is calibrated against the supplied architectural blueprint:
- **Project**: Villa 253, North Facing, 24 Type – 3 Bedroom with Roof Gazebo
- **Drawing Type**: Wall Marking Drawing
- **Date**: `10-10-24`
- **Revision**: `0` (`R0`)
- **Authoritative Source File**: `/cad/VILLA_253_WALL_MARKING_10_10_24_REV0.pdf` (also downloadable via `/api/cad/villa253.pdf`)
- **Editable Working CAD File**: `/cad/Villa253_FloorPlan_Editable_R0.dxf` (also downloadable via `/api/cad/villa253.dxf`)

### Verified Key Dimensions (Wall Marking Drawing R0)
| Room ID | Space Designation | Floor | Verified Dimensions | Area (sq.ft) | Key Openings & Adjuncts |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `ROOM-V253-LIV-01` | Living & Dining Great Room | Ground | `25'-4" × 19'-0"` | 481 | `SD1` (`27'0"×10'3"`), `SD5` (`11'0"×10'3"`), `W1`, `FW1`; Front Deck `57'2"×9'6"`, Rear Deck `13'0"×9'6"` |
| `ROOM-V253-BED1-01` | Master Bedroom 1 Suite | Ground | `14'-0" × 19'-0"` | 266 | `SD2` (`12'0"×10'3"`), `SD4` (`10'0"×10'3"`), `SD7` (`7'0"×10'3"`), `D1`, `D2`; Walk-in Wardrobe `10'2"×11'9"`, Toilet 1 `6'0"×24'9"` (`14'0"×7'0"`), Private Deck `11'6"×4'6"` |
| `ROOM-V253-BED2-01` | Bedroom 2 & Bar Deck Suite | Ground | `18'-11" × 19'-0"` | 359 | `SD2` (`12'0"×10'3"`), `SD6` (`9'0"×10'3"`), `D1`, `D3`, `W5`, `FW2`; Bar Unit Deck `14'0"×30'10"`, Wardrobe `7'9"×9'8"`, Toilet 2 `10'4"×9'8"` |
| `ROOM-V253-KIT-01` | Culinary Kitchen, Utility & Powder Wing | Ground | `14'-6" × 9'-0"` | 131 | `D4` (`3'0"×7'8"`), `W3`, `W4`; Utility `9'0"×9'8"`, Powder Room `5'0"×9'8"` |
| `ROOM-V253-STAIR-01` | Architectural Dogleg Staircase Core | Ground / 1F | `7'-6" × 19'-0"` | 143 | 21 Risers (`Tread 11"`, `Riser 6.25"`, `3'6"` Waist & Landing); Fixed Glass `W2 & W2A`, Sliders `SD3` & `SD4A` |
| `ROOM-V253-BED3-01` | First Floor Bedroom 3 & Balconies | First | `20'-8" × 19'-0"` | 393 | `SD1A` (`12'0"`), `SD2A` (`10'0"`), `SD3A` (`8'0"`), `D1A`, `D2A`, `W3A`; Front Balcony `24'4"×4'0"`, Side Balcony `14'10"×4'0"`, Toilet 3 `9'9"×9'2"` |
| `ROOM-V253-GAZEBO-01` | Signature Roof Gazebo Pavilion | Roof / 1F | `24'-0" × 18'-0"` | 432 | Section BB' Pitched Timber Pergola (Ridge `12'-9"` above First Floor Slab), `SD4A` access |

---

## 2. Summary of Application Logic Fixes

1. **Removed `ALL` Wildcard Image Mapping**:
   - Previously, `VILLA_253_ALL_REFERENCE_IMAGES` included `'ALL'` inside `applicableRooms` for every image, causing the same Living/Master/Gazebo images and camera cones to appear on every room tab.
   - Now, each reference image is strictly mapped only to its authentic `applicableRooms` IDs without `'ALL'`.

2. **Corrected Mismatched Room IDs**:
   - Standardized all room IDs across `villa253BlueprintData.ts`, `villa253ReferenceImages.ts`, `floorplanSpatialData.ts`, and `interiorRenderEngine.ts`:
     - Bedroom 1: `ROOM-V253-BED1-01` (fixed from `ROOM-V253-BED-01`)
     - Bedroom 2: `ROOM-V253-BED2-01` (fixed from `ROOM-V253-BED-02`, and updated dimensions to `18'-11" × 19'-0"`)
     - Bedroom 3: `ROOM-V253-BED3-01` (`20'-8" × 19'-0"`)
     - Roof Gazebo: `ROOM-V253-GAZEBO-01` (fixed from `ROOM-V253-GZB-01`)
     - Kitchen & Utility: `ROOM-V253-KIT-01` (`14'-6" × 9'-0"`)
     - Staircase Core: `ROOM-V253-STAIR-01` (`7'-6" × 19'-0"`)

3. **Added Image URL De-duplication**:
   - Added `deduplicateReferenceImages()` in `src/data/villa253ReferenceImages.ts` and enforced URL-level de-duplication in `getReferenceImagesForRoom()`, `FloorPlanReferenceGallery.tsx`, and `VisualConceptLightboxModal.tsx`.

4. **Removed Living-Room Image Fallback for Non-Living Rooms**:
   - Removed the fallback in `getCalibratedConceptForLayout()` and `TwoStepSpatialDesignStudio.tsx` that previously defaulted any uncalibrated layout or room to `villa253_living_greatroom_1790833681710.jpg` or `ROOM-LIV-01`.
   - Every Villa 253 room now has dedicated layouts in `VILLA_253_LAYOUTS_BY_ROOM`, dedicated concepts in `INITIAL_VILLA_253_CONCEPTS`, and room-type-specific render resolution.

5. **Interior Renders Driven by Villa 253 Source Plan + Exact Room Dimensions**:
   - `interiorRenderEngine.ts` now inspects the exact room ID, room type, and Villa 253 Wall Marking Drawing R0 dimensions (`25'4"×19'0"`, `14'0"×19'0"`, `18'11"×19'0"`, `20'8"×19'0"`, `7'6"×19'0"`, `14'6"×9'0"`, `24'0"×18'0"`) and synthesizes room-specific interior architecture (Bedroom suite, Kitchen parallel counters, Dogleg staircase with W2/W2A glazing, Roof Gazebo pitched timber pergola, or Living & Dining with 27ft SD1 portal) with an embedded Villa 253 CAD key-plan stamp.

6. **Generate All Room Images for Complete Villa 253**:
   - Added batch generation (`POST /api/ai/generate-all-villa253-rooms` and UI button **"Generate All Room Images"**) to synthesize and update room-specific interior renders across all 7 spaces of Villa 253 in one click.

7. **Room-Specific Filenames**:
   - Replaced random `Math.random()` image filenames with deterministic, room-specific filenames (`villa253_<room_id>_<dimensions>_<style>.svg/.jpg`).

8. **Vector Floor-Plan Preview & 8-Layer Editable DXF**:
   - Replaced the misleading raster photo "CAD" fallback with `Villa253VectorCadPreview.tsx` and `/cad/Villa253_FloorPlan_Editable_R0.dxf` featuring 8 separate CAD layers:
     - `A-WALL` (Walls)
     - `A-DOOR` (Doors)
     - `A-WIND` (Windows)
     - `A-STRS` (Staircase)
     - `A-DECK` (Decks & Balconies)
     - `A-DIMS` (Dimensions)
     - `A-TEXT` (Text & Room Labels)
     - `A-NOTE` (Title Block & Construction Authority Notes)

---

## 3. Important CAD Distinction
The supplied DXF (`Villa253_FloorPlan_Editable_R0.dxf`) is an **editable, dimension-driven working reconstruction** from the supplied Villa 253 Wall Marking Drawing R0 (`10-10-24`), rather than a raster image disguised as a CAD file. It can be opened and edited in **AutoCAD, DraftSight, BricsCAD, LibreCAD, or QCAD**.

**Note**: The DXF is an editable working reconstruction, not a certified construction DWG. The original architectural PDF (`VILLA_253_WALL_MARKING_10_10_24_REV0.pdf`) remains the construction authority and the DXF should be checked by the architect/CAD operator before construction use.
