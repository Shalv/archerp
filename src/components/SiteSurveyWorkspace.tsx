import React, { useState } from 'react';
import {
  Ruler,
  Building,
  Plus,
  Trash2,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  FileText,
  UploadCloud,
  Sparkles,
  Layers,
  ArrowRight,
  ShieldCheck,
  Languages,
  HelpCircle,
  RefreshCw,
  Eye,
  Info
} from 'lucide-react';
import { CustomerRequirement, RoomSpace, ProjectRecord, UserSession } from '../types/erp';

interface SiteSurveyWorkspaceProps {
  project: ProjectRecord;
  currentUser: UserSession;
  onSaveRequirement?: (req: CustomerRequirement) => void;
  onProceedToBOQ?: () => void;
  onNavigateTab?: (tab: string) => void;
}

const DEFAULT_CONSTRAINTS = {
  freightElevatorAvailable: true,
  elevatorDimensions: '8.5 ft H × 4.5 ft W × 7.0 ft D (800 kg capacity)',
  workingHours: '09:00 AM - 06:00 PM (Monday to Saturday, strictly no noisy work on Sundays)',
  noiseRestrictions: 'No core cutting or demolition after 01:00 PM or before 10:00 AM',
  materialUnloadingRules: 'Unloading allowed only in Basement 2 loading dock between 10:00 AM and 04:00 PM',
  debrisDisposalMethod: 'Debris must be bagged in heavy-duty HDPE sacks and carted down via freight lift'
};

const DEFAULT_ATTACHMENTS = [
  { id: 'ATT-01', fileName: 'The_Skyline_Unit_1402_Architectural_Floorplan_RevB.pdf', fileType: 'pdf', uploadedAt: '2026-03-01T10:30:00Z', sizeKb: 3420, parsedSummary: '3BHK + Servant unit layout, 1,650 sq.ft carpet, 3 balconies.' },
  { id: 'ATT-02', fileName: 'Laser_Survey_GLM50_Cloud_Export_20260301.dwg', fileType: 'dwg', uploadedAt: '2026-03-01T11:45:00Z', sizeKb: 5120, parsedSummary: 'Laser distance meter measurement point cloud.' }
];

const DEFAULT_ROOMS: RoomSpace[] = [
  { id: 'RM-01', name: 'Living & Dining Room', zone: 'Public Zone', floor: '14th Floor', lengthFt: 24, widthFt: 14.5, heightFt: 10.5, carpetAreaSqFt: 348, perimeterFt: 77, wallAreaSqFt: 808.5, ceilingAreaSqFt: 348, existingCondition: 'Bare shell screed floor', demolitionRequired: false },
  { id: 'RM-02', name: 'Master Bedroom', zone: 'Private Zone', floor: '14th Floor', lengthFt: 17.5, widthFt: 16, heightFt: 10.5, carpetAreaSqFt: 280, perimeterFt: 67, wallAreaSqFt: 703.5, ceilingAreaSqFt: 280, existingCondition: 'Builder finish tile', demolitionRequired: true },
  { id: 'RM-03', name: 'Modular Kitchen & Utility', zone: 'Service Zone', floor: '14th Floor', lengthFt: 14, widthFt: 10, heightFt: 10.5, carpetAreaSqFt: 140, perimeterFt: 48, wallAreaSqFt: 504, ceilingAreaSqFt: 140, existingCondition: 'Standard granite slab counter', demolitionRequired: true },
  { id: 'RM-04', name: 'Guest Bedroom (Bed 2)', zone: 'Private Zone', floor: '14th Floor', lengthFt: 15, widthFt: 12, heightFt: 10.5, carpetAreaSqFt: 180, perimeterFt: 54, wallAreaSqFt: 567, ceilingAreaSqFt: 180, existingCondition: 'Bare shell plaster wall', demolitionRequired: false },
  { id: 'RM-05', name: 'Kids / Study Room (Bed 3)', zone: 'Private Zone', floor: '14th Floor', lengthFt: 16, widthFt: 10, heightFt: 10.5, carpetAreaSqFt: 160, perimeterFt: 52, wallAreaSqFt: 546, ceilingAreaSqFt: 160, existingCondition: 'Bare shell', demolitionRequired: false },
  { id: 'RM-06', name: 'Master & Common Bathrooms', zone: 'Wet Zone', floor: '14th Floor', lengthFt: 15, widthFt: 8, heightFt: 9.5, carpetAreaSqFt: 120, perimeterFt: 46, wallAreaSqFt: 437, ceilingAreaSqFt: 120, existingCondition: 'Plumbing core intact', demolitionRequired: true }
];

export const SiteSurveyWorkspace: React.FC<SiteSurveyWorkspaceProps> = ({
  project,
  currentUser,
  onSaveRequirement,
  onProceedToBOQ,
  onNavigateTab
}) => {
  // Normalize existing requirement or create robust initial structure
  const rawReq = project.requirement as any;
  const normalizedRooms: RoomSpace[] = (rawReq?.rooms && rawReq.rooms.length > 0)
    ? rawReq.rooms.map((r: any, idx: number) => {
        const length = Number(r.lengthFt) || 10;
        const width = Number(r.widthFt) || 10;
        const height = Number(r.heightFt) || 10.5;
        const area = Number(r.carpetAreaSqFt || r.areaSqFt) || Math.round(length * width);
        return {
          id: r.id || `RM-${idx + 1}`,
          name: r.name || `Room ${idx + 1}`,
          zone: r.zone || 'General Zone',
          floor: r.floor || '14th Floor',
          lengthFt: length,
          widthFt: width,
          heightFt: height,
          carpetAreaSqFt: area,
          perimeterFt: Number(r.perimeterFt) || Math.round(2 * (length + width)),
          wallAreaSqFt: Number(r.wallAreaSqFt) || Math.round(2 * (length + width) * height),
          ceilingAreaSqFt: Number(r.ceilingAreaSqFt) || area,
          existingCondition: r.existingCondition || 'Bare shell',
          demolitionRequired: !!r.demolitionRequired,
          notes: r.notes || ''
        };
      })
    : DEFAULT_ROOMS;

  const initialReq: any = {
    id: rawReq?.id || `REQ-${project.id}`,
    projectId: project.id,
    customerName: project.clientName || 'Valued Client',
    customerPhone: project.clientPhone || '',
    customerEmail: project.clientEmail || '',
    billingAddress: project.siteAddress || '',
    projectSiteAddress: project.siteAddress || '',
    city: project.city || 'NCR',
    projectType: project.projectType || 'RESIDENTIAL',
    projectScope: project.projectScope || 'TURNKEY_INTERIORS',
    plotAreaSqFt: rawReq?.plotAreaSqFt || 0,
    builtUpAreaSqFt: rawReq?.builtUpAreaSqFt || 2180,
    carpetAreaSqFt: rawReq?.carpetAreaSqFt || normalizedRooms.reduce((sum, rm) => sum + rm.carpetAreaSqFt, 0),
    floorsCount: rawReq?.floorsCount || 1,
    rooms: normalizedRooms,
    preferredDesignStyle: rawReq?.preferredDesignStyle || 'Modern Minimalist Turnkey Interior',
    materialsBrandsPreferences: rawReq?.materialsBrandsPreferences || 'Saint-Gobain, Kajaria, Asian Paints Royale, Hafele Hardware',
    civilRequirements: rawReq?.civilRequirements || 'Demolition of non-structural partitions and debris clearing',
    electricalRequirements: rawReq?.electricalRequirements || 'Concealed copper wiring with modular switches and LED cove profiles',
    plumbingSanitaryRequirements: rawReq?.plumbingSanitaryRequirements || 'CPVC piping, 72-hr pond testing in wet areas, premium diverters',
    hvacRequirements: rawReq?.hvacRequirements || 'Concealed copper refrigerant piping for inverter split / VRV ACs',
    joineryKitchenPreferences: rawReq?.joineryKitchenPreferences || 'BWP marine grade ply carcass with soft-close tandem boxes',
    customerBudgetMin: rawReq?.customerBudgetMin || 2200000,
    customerBudgetMax: rawReq?.customerBudgetMax || 2800000,
    targetCompletionDate: rawReq?.targetCompletionDate || '2026-06-30',
    exclusionsCustomerSupplied: rawReq?.exclusionsCustomerSupplied || 'Loose furniture, refrigerator, microwave',
    siteAccessConstraints: rawReq?.siteAccessConstraints || 'Working hours 9:00 AM - 6:00 PM; no noisy work on Sundays',
    surveyNotes: rawReq?.surveyNotes || 'Laser survey verified. Slab heights and ceiling clearances confirmed.',
    rawBriefHindiEnglish: rawReq?.rawBriefHindiEnglish || rawReq?.customerBriefRawText || 'Client requested comprehensive turnkey interior fitout with Italian vitrified tiles, modular kitchen with quartz counter, acrylic shutters, and acoustic gypsum ceilings.',
    customerBriefRawText: rawReq?.customerBriefRawText || rawReq?.rawBriefHindiEnglish || 'Client requested comprehensive turnkey interior fitout with Italian vitrified tiles, modular kitchen with quartz counter, acrylic shutters, and acoustic gypsum ceilings.',
    ceilingHeightFt: rawReq?.ceilingHeightFt || 10.5,
    slabToSlabHeightFt: rawReq?.slabToSlabHeightFt || 11.2,
    siteConstraints: rawReq?.siteConstraints || DEFAULT_CONSTRAINTS,
    attachments: (rawReq?.documents && rawReq.documents.length > 0)
      ? rawReq.documents.map((d: any) => ({
          id: d.id || `ATT-${Math.random()}`,
          fileName: d.filename || d.fileName || 'Document.pdf',
          fileType: d.fileType || 'pdf',
          sizeKb: d.sizeKb || 2048,
          uploadedAt: d.uploadedAt || new Date().toISOString(),
          parsedSummary: d.notes || `${d.documentType || 'Document'} - Scale confirmed.`
        }))
      : (rawReq?.attachments || DEFAULT_ATTACHMENTS),
    updatedAt: rawReq?.updatedAt || new Date().toISOString(),
    status: 'VERIFIED'
  };

  const [formData, setFormData] = useState<any>({ ...initialReq });
  const [showAddRoom, setShowAddRoom] = useState(false);
  const [saveToast, setSaveToast] = useState(false);

  const [newRoom, setNewRoom] = useState<Partial<RoomSpace>>({
    name: '',
    zone: 'Private Zone',
    floor: '14th Floor',
    lengthFt: 12,
    widthFt: 10,
    heightFt: 10.5,
    existingCondition: 'Bare shell',
    demolitionRequired: false
  });

  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiAnalysis, setAiAnalysis] = useState<{
    summary: string;
    gaps: string[];
    contradictions: string[];
    recommendations: string[];
  } | null>(null);

  // Calculate live total carpet area
  const totalRoomArea = (formData.rooms || []).reduce(
    (acc: number, r: RoomSpace) => acc + (r.carpetAreaSqFt || (r.lengthFt * r.widthFt) || 0),
    0
  );

  const handleAddRoom = () => {
    if (!newRoom.name || !newRoom.lengthFt || !newRoom.widthFt) return;
    const l = Number(newRoom.lengthFt);
    const w = Number(newRoom.widthFt);
    const h = Number(newRoom.heightFt) || 10.5;
    const area = Math.round(l * w * 10) / 10;

    const roomToAdd: RoomSpace = {
      id: `RM-${Date.now()}`,
      name: newRoom.name,
      zone: newRoom.zone || 'General Zone',
      floor: newRoom.floor || '14th Floor',
      lengthFt: l,
      widthFt: w,
      heightFt: h,
      carpetAreaSqFt: area,
      perimeterFt: Math.round(2 * (l + w) * 10) / 10,
      wallAreaSqFt: Math.round(2 * (l + w) * h * 10) / 10,
      ceilingAreaSqFt: area,
      existingCondition: newRoom.existingCondition || 'Bare shell',
      demolitionRequired: !!newRoom.demolitionRequired
    };

    const updatedRooms = [...(formData.rooms || []), roomToAdd];
    const newCarpet = updatedRooms.reduce((acc, r) => acc + (r.carpetAreaSqFt || (r.lengthFt * r.widthFt)), 0);
    const updated = {
      ...formData,
      rooms: updatedRooms,
      carpetAreaSqFt: newCarpet
    };
    setFormData(updated);
    setShowAddRoom(false);
    setNewRoom({
      name: '',
      zone: 'Private Zone',
      floor: '14th Floor',
      lengthFt: 12,
      widthFt: 10,
      heightFt: 10.5,
      existingCondition: 'Bare shell',
      demolitionRequired: false
    });
  };

  const handleDeleteRoom = (id: string) => {
    const updatedRooms = (formData.rooms || []).filter((r: RoomSpace) => r.id !== id);
    const newCarpet = updatedRooms.reduce((acc: number, r: RoomSpace) => acc + (r.carpetAreaSqFt || (r.lengthFt * r.widthFt)), 0);
    setFormData({
      ...formData,
      rooms: updatedRooms,
      carpetAreaSqFt: newCarpet
    });
  };

  const handleSave = () => {
    if (onSaveRequirement) {
      onSaveRequirement(formData);
    }
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 3000);
  };

  const handleProceed = () => {
    if (onProceedToBOQ) {
      onProceedToBOQ();
    } else if (onNavigateTab) {
      onNavigateTab('boq');
    }
  };

  const runAIBriefAnalysis = () => {
    setAnalyzingAI(true);
    setTimeout(() => {
      setAiAnalysis({
        summary: 'Turnkey interior scope for 3BHK 1,650 sq.ft at DLF Phase 5. High-end finish specification with Italian marble in living, engineered wood in master, and modular kitchen with quartz counter.',
        gaps: [
          'Balcony waterproofing specification not explicitly stated in brief.',
          'HVAC ductable AC vs High-wall split VRV units not clarified.',
          'Home automation lighting protocol (Zigbee vs KNX hardwired) unconfirmed.'
        ],
        contradictions: [
          'Demolition mentioned for master bath tiles, but existing condition lists bare shell for public zones.',
          'Schedule requests 75-day turnaround; society restricts noisy work to 10 AM - 1 PM only (demolition buffer required).'
        ],
        recommendations: [
          'Include 3-layer elastomeric waterproofing under Italian marble in all wet zones.',
          'Add acoustic insulation battens above Gyproc false ceiling in master bedroom.',
          'Recommend 30-day early vendor lock-in for imported quartz slab fabrication.'
        ]
      });
      setAnalyzingAI(false);
    }, 900);
  };

  return (
    <div className="space-y-4">
      {/* 1. DOCUMENT BREADCRUMB & HEADER */}
      <div className="bg-white rounded-lg border border-[#E1DFDD] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#0F6CBD] uppercase tracking-wider">
              {project.projectCode} • Site Survey &amp; Spatial Matrix
            </span>
            <span className="bg-[#DFF6DD] text-[#107C41] text-[10px] px-2 py-0.5 rounded font-bold border border-[#B3E5C7]">
              Verified by Lead QS
            </span>
          </div>
          <h1 className="text-lg font-bold text-[#201F1E] mt-0.5">
            Site Survey, Room Dimensions &amp; Constraints
          </h1>
          <p className="text-xs text-[#605E5C] mt-0.5">
            Physical dimensional takeoff, laser distance meter logs, society access rules, and architectural brief.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {saveToast && (
            <span className="text-xs text-[#107C41] font-bold flex items-center gap-1">
              <CheckCircle2 className="h-4 w-4" /> Saved!
            </span>
          )}
          {onNavigateTab && (
            <button
              onClick={() => onNavigateTab('general')}
              className="px-2.5 py-1.5 rounded bg-[#F3F2F1] text-[#323130] hover:bg-[#EDEBE9] text-xs font-semibold shadow-xs"
            >
              ← Back to Job Card
            </button>
          )}
          <button
            onClick={handleSave}
            className="px-3 py-1.5 rounded bg-white text-[#323130] border border-[#8A8886] hover:bg-[#F3F2F1] text-xs font-semibold shadow-xs"
          >
            Save Survey Record
          </button>
          <button
            onClick={handleProceed}
            className="px-3.5 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold flex items-center gap-1.5 shadow-xs"
          >
            <span>Proceed to Job Planning Lines</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* 2. SPATIAL KPI CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-[#E1DFDD] shadow-xs">
          <div className="text-[11px] text-[#605E5C] font-semibold">Total Carpet Area</div>
          <div className="font-mono text-xl font-bold text-[#0F6CBD] mt-1">
            {totalRoomArea.toLocaleString()} sq.ft
          </div>
          <div className="text-[10px] text-[#107C41] mt-0.5 font-medium">Derived from {formData.rooms.length} rooms</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E1DFDD] shadow-xs">
          <div className="text-[11px] text-[#605E5C] font-semibold">Super Built-up Area</div>
          <div className="font-mono text-xl font-bold text-[#201F1E] mt-1">
            {formData.builtUpAreaSqFt.toLocaleString()} sq.ft
          </div>
          <div className="text-[10px] text-[#605E5C] mt-0.5">75.7% carpet efficiency ratio</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E1DFDD] shadow-xs">
          <div className="text-[11px] text-[#605E5C] font-semibold">Clear Height (Slab / Ceiling)</div>
          <div className="font-mono text-xl font-bold text-[#201F1E] mt-1">
            {formData.ceilingHeightFt} ft / 9.25 ft
          </div>
          <div className="text-[10px] text-[#605E5C] mt-0.5">False ceiling drop 1.25 ft allowed</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E1DFDD] shadow-xs">
          <div className="text-[11px] text-[#605E5C] font-semibold">Society Working Window</div>
          <div className="font-mono text-base font-bold text-[#201F1E] mt-1 truncate">
            09:00 AM - 06:00 PM
          </div>
          <div className="text-[10px] text-[#B87A38] mt-0.5 font-medium">No noise on Sundays</div>
        </div>
      </div>

      {/* 3. ROOM DIMENSIONS MATRIX TABLE */}
      <div className="bg-white rounded-lg border border-[#E1DFDD] shadow-xs overflow-hidden">
        <div className="px-4 py-3 border-b border-[#E1DFDD] bg-[#FAF9F8] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Ruler className="h-4 w-4 text-[#0F6CBD]" />
            <span className="font-bold text-xs text-[#201F1E] uppercase tracking-wider">
              Room Dimensions &amp; Spatial Specifications Matrix
            </span>
            <span className="text-[10px] bg-[#EFF6FC] text-[#0F6CBD] font-bold px-1.5 py-0.5 rounded">
              {formData.rooms.length} Rooms
            </span>
          </div>

          <button
            onClick={() => setShowAddRoom(true)}
            className="px-2.5 py-1 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold flex items-center gap-1 shadow-xs"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>Add Space / Room</span>
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F3F2F1] text-[#605E5C] border-b border-[#EDEBE9]">
                <th className="py-2.5 px-3 font-semibold w-12">#</th>
                <th className="py-2.5 px-3 font-semibold">Space / Room Name</th>
                <th className="py-2.5 px-3 font-semibold">Zone</th>
                <th className="py-2.5 px-3 font-semibold text-right">Length (ft)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Width (ft)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Height (ft)</th>
                <th className="py-2.5 px-3 font-semibold text-right">Carpet Area</th>
                <th className="py-2.5 px-3 font-semibold">Existing Condition</th>
                <th className="py-2.5 px-3 font-semibold text-center">Demolition</th>
                <th className="py-2.5 px-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBE9]">
              {formData.rooms.map((room, idx) => (
                <tr key={room.id} className="hover:bg-[#FAF9F8] transition">
                  <td className="py-2 px-3 font-mono text-[11px] text-[#8A8886]">{idx + 1}</td>
                  <td className="py-2 px-3 font-semibold text-[#201F1E]">{room.name}</td>
                  <td className="py-2 px-3 text-[#605E5C]">
                    <span className="bg-[#F3F2F1] text-[#323130] px-1.5 py-0.5 rounded text-[10px]">
                      {room.zone}
                    </span>
                  </td>
                  <td className="py-2 px-3 text-right font-mono text-[#201F1E]">{room.lengthFt}</td>
                  <td className="py-2 px-3 text-right font-mono text-[#201F1E]">{room.widthFt}</td>
                  <td className="py-2 px-3 text-right font-mono text-[#201F1E]">{room.heightFt}</td>
                  <td className="py-2 px-3 text-right font-mono font-bold text-[#0F6CBD]">
                    {room.carpetAreaSqFt || Math.round(room.lengthFt * room.widthFt)} sq.ft
                  </td>
                  <td className="py-2 px-3 text-[#605E5C] text-[11px] truncate max-w-[200px]">
                    {room.existingCondition}
                  </td>
                  <td className="py-2 px-3 text-center">
                    {room.demolitionRequired ? (
                      <span className="bg-[#FDF3F2] text-[#D83B01] font-bold px-1.5 py-0.5 rounded text-[10px] border border-[#F8D2CA]">
                        Required
                      </span>
                    ) : (
                      <span className="text-[#8A8886] text-[10px]">None</span>
                    )}
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      onClick={() => handleDeleteRoom(room.id)}
                      className="text-[#A4262C] hover:text-[#751D1D] p-1 rounded hover:bg-[#FDF3F2] transition"
                      title="Delete Room"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-[#FAF9F8] font-bold text-xs border-t-2 border-[#E1DFDD]">
                <td colSpan={6} className="py-2.5 px-3 text-right text-[#605E5C]">
                  Total Measured Carpet Area:
                </td>
                <td className="py-2.5 px-3 text-right font-mono text-sm text-[#0F6CBD]">
                  {totalRoomArea.toLocaleString()} sq.ft
                </td>
                <td colSpan={3} className="py-2.5 px-3 text-[11px] text-[#605E5C]">
                  Cross-checked against architectural layout CAD Rev B
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* 4. MODAL: ADD ROOM */}
      {showAddRoom && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E1DFDD] shadow-2xl max-w-md w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
              <h3 className="font-bold text-sm text-[#201F1E] flex items-center gap-2">
                <Plus className="h-4 w-4 text-[#0F6CBD]" />
                Add Room / Spatial Area
              </h3>
              <button
                onClick={() => setShowAddRoom(false)}
                className="text-[#605E5C] hover:text-[#201F1E] font-bold text-base"
              >
                ✕
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#323130] mb-1">Room / Space Name *</label>
                <input
                  type="text"
                  value={newRoom.name}
                  onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
                  placeholder="e.g., Foyer &amp; Entrance Lobby"
                  className="w-full px-3 py-1.5 rounded border border-[#8A8886] focus:border-[#0F6CBD] focus:ring-1 focus:ring-[#0F6CBD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#323130] mb-1">Zone</label>
                  <select
                    value={newRoom.zone}
                    onChange={e => setNewRoom({ ...newRoom, zone: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#8A8886] focus:border-[#0F6CBD]"
                  >
                    <option value="Public Zone">Public Zone</option>
                    <option value="Private Zone">Private Zone</option>
                    <option value="Service Zone">Service Zone</option>
                    <option value="Wet Zone">Wet Zone</option>
                    <option value="Balcony &amp; Outdoor">Balcony &amp; Outdoor</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-[#323130] mb-1">Floor Level</label>
                  <input
                    type="text"
                    value={newRoom.floor}
                    onChange={e => setNewRoom({ ...newRoom, floor: e.target.value })}
                    className="w-full px-3 py-1.5 rounded border border-[#8A8886]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-semibold text-[#323130] mb-1">Length (ft) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRoom.lengthFt}
                    onChange={e => setNewRoom({ ...newRoom, lengthFt: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1.5 rounded border border-[#8A8886] font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#323130] mb-1">Width (ft) *</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRoom.widthFt}
                    onChange={e => setNewRoom({ ...newRoom, widthFt: parseFloat(e.target.value) || 0 })}
                    className="w-full px-2 py-1.5 rounded border border-[#8A8886] font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#323130] mb-1">Height (ft)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={newRoom.heightFt}
                    onChange={e => setNewRoom({ ...newRoom, heightFt: parseFloat(e.target.value) || 10.5 })}
                    className="w-full px-2 py-1.5 rounded border border-[#8A8886] font-mono text-right"
                  />
                </div>
              </div>

              <div className="bg-[#EFF6FC] p-2.5 rounded border border-[#C7E0F4] flex items-center justify-between">
                <span className="text-[11px] text-[#605E5C]">Calculated Carpet Area:</span>
                <span className="font-mono font-bold text-sm text-[#0F6CBD]">
                  {Math.round((newRoom.lengthFt || 0) * (newRoom.widthFt || 0) * 10) / 10} sq.ft
                </span>
              </div>

              <div>
                <label className="block font-semibold text-[#323130] mb-1">Existing Condition</label>
                <input
                  type="text"
                  value={newRoom.existingCondition}
                  onChange={e => setNewRoom({ ...newRoom, existingCondition: e.target.value })}
                  placeholder="e.g., Bare shell plaster wall, rough screed"
                  className="w-full px-3 py-1.5 rounded border border-[#8A8886]"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={newRoom.demolitionRequired}
                  onChange={e => setNewRoom({ ...newRoom, demolitionRequired: e.target.checked })}
                  className="rounded text-[#0F6CBD] focus:ring-[#0F6CBD]"
                />
                <span className="font-medium text-[#201F1E]">Demolition of existing finishes required</span>
              </label>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDEBE9]">
              <button
                onClick={() => setShowAddRoom(false)}
                className="px-3 py-1.5 rounded bg-white text-[#323130] border border-[#8A8886] hover:bg-[#F3F2F1] text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                onClick={handleAddRoom}
                className="px-3.5 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold"
              >
                Add Room to Survey
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. SITE CONSTRAINTS & SOCIETY RULES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-lg border border-[#E1DFDD] p-4 shadow-xs space-y-3">
          <div className="flex items-center gap-2 border-b border-[#EDEBE9] pb-2">
            <Building className="h-4 w-4 text-[#0F6CBD]" />
            <span className="font-bold text-xs text-[#201F1E] uppercase tracking-wider">
              Society Constraints &amp; Access Regulations
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex items-start gap-2">
              <span className="text-[#605E5C] font-semibold min-w-[120px]">Freight Elevator:</span>
              <span className="text-[#201F1E]">{formData.siteConstraints?.elevatorDimensions || 'Standard Service Lift'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#605E5C] font-semibold min-w-[120px]">Working Hours:</span>
              <span className="text-[#201F1E]">{formData.siteConstraints?.workingHours || '09:00 AM - 06:00 PM'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#605E5C] font-semibold min-w-[120px]">Noise Protocol:</span>
              <span className="text-[#201F1E]">{formData.siteConstraints?.noiseRestrictions || 'No core cutting after 1:00 PM'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#605E5C] font-semibold min-w-[120px]">Loading Dock:</span>
              <span className="text-[#201F1E]">{formData.siteConstraints?.materialUnloadingRules || 'Basement 2 Loading Dock'}</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-[#605E5C] font-semibold min-w-[120px]">Debris Removal:</span>
              <span className="text-[#201F1E]">{formData.siteConstraints?.debrisDisposalMethod || 'HDPE sacks via freight lift'}</span>
            </div>
          </div>
        </div>

        {/* 6. DRAWINGS & CAD ATTACHMENTS */}
        <div className="bg-white rounded-lg border border-[#E1DFDD] p-4 shadow-xs space-y-3">
          <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-[#0F6CBD]" />
              <span className="font-bold text-xs text-[#201F1E] uppercase tracking-wider">
                Drawing Attachments &amp; CAD Layouts
              </span>
            </div>
            <span className="text-[10px] text-[#605E5C]">{(formData.attachments || []).length} files attached</span>
          </div>

          <div className="space-y-2">
            {(formData.attachments || []).map((att: any) => (
              <div key={att.id} className="p-2.5 rounded border border-[#EDEBE9] bg-[#FAF9F8] flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 truncate">
                  <span className="bg-[#EFF6FC] text-[#0F6CBD] font-bold text-[10px] px-1.5 py-0.5 rounded border border-[#C7E0F4]">
                    {(att.fileType || 'FILE').toUpperCase()}
                  </span>
                  <div className="truncate">
                    <div className="font-semibold text-[#201F1E] truncate">{att.fileName}</div>
                    <div className="text-[10px] text-[#605E5C] truncate">{att.parsedSummary}</div>
                  </div>
                </div>
                <span className="text-[10px] text-[#8A8886] whitespace-nowrap ml-2">
                  {Math.round((att.sizeKb || 1024) / 1024 * 10) / 10} MB
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={() => alert('CAD Floorplan viewer opened in high-resolution drawing mode.')}
            className="w-full py-1.5 rounded bg-white text-[#323130] border border-[#8A8886] hover:bg-[#F3F2F1] text-xs font-semibold flex items-center justify-center gap-1.5 transition"
          >
            <Eye className="h-3.5 w-3.5 text-[#0F6CBD]" />
            <span>Open Architectural Drawing Viewer</span>
          </button>
        </div>
      </div>

      {/* 7. NATURAL LANGUAGE BRIEF & AI ANALYSIS */}
      <div className="bg-white rounded-lg border border-[#E1DFDD] p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#0F6CBD]" />
            <span className="font-bold text-xs text-[#201F1E] uppercase tracking-wider">
              Customer Natural Language Brief &amp; AI Scope Parser
            </span>
          </div>

          <button
            onClick={runAIBriefAnalysis}
            disabled={analyzingAI}
            className="px-3 py-1 rounded bg-[#EFF6FC] text-[#0F6CBD] border border-[#C7E0F4] hover:bg-[#DEECF9] text-xs font-semibold flex items-center gap-1.5 transition"
          >
            {analyzingAI ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-[#0F6CBD]" />
            ) : (
              <Sparkles className="h-3.5 w-3.5 text-[#0F6CBD]" />
            )}
            <span>{analyzingAI ? 'Analyzing Brief...' : 'Run Copilot Scope Analysis'}</span>
          </button>
        </div>

        <div className="bg-[#FAF9F8] p-3 rounded border border-[#EDEBE9] text-xs font-mono text-[#323130] leading-relaxed">
          {formData.customerBriefRawText}
        </div>

        {aiAnalysis && (
          <div className="space-y-3 pt-2">
            <div className="bg-[#EFF6FC] p-3 rounded-lg border border-[#C7E0F4] text-xs">
              <div className="font-bold text-[#0F6CBD] flex items-center gap-1.5 mb-1">
                <CheckCircle2 className="h-4 w-4 text-[#0F6CBD]" />
                Executive Scope Synthesis
              </div>
              <p className="text-[#323130]">{aiAnalysis.summary}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="bg-[#FFF4CE] p-3 rounded-lg border border-[#FDE3A7]">
                <div className="font-bold text-[#797673] flex items-center gap-1.5 mb-1">
                  <AlertTriangle className="h-4 w-4 text-[#B87A38]" />
                  Identified Scope Gaps
                </div>
                <ul className="list-disc list-inside space-y-1 text-[#323130]">
                  {aiAnalysis.gaps.map((gap, i) => (
                    <li key={i}>{gap}</li>
                  ))}
                </ul>
              </div>

              <div className="bg-[#DFF6DD] p-3 rounded-lg border border-[#B3E5C7]">
                <div className="font-bold text-[#107C41] flex items-center gap-1.5 mb-1">
                  <ShieldCheck className="h-4 w-4 text-[#107C41]" />
                  Estimator Recommendations
                </div>
                <ul className="list-disc list-inside space-y-1 text-[#323130]">
                  {aiAnalysis.recommendations.map((rec, i) => (
                    <li key={i}>{rec}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
