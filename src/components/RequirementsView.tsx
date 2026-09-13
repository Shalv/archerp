import React, { useState } from 'react';
import { 
  Building, 
  Ruler, 
  UploadCloud, 
  FileText, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Trash2, 
  HelpCircle,
  Layers,
  ArrowRight,
  Languages,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';
import { CustomerRequirement, RoomSpace, UploadedBriefDocument, UserSession } from '../types/erp';

interface RequirementsViewProps {
  requirement: CustomerRequirement;
  currentUser: UserSession;
  onSaveRequirement: (req: CustomerRequirement) => void;
  onProceedToBOQ: () => void;
}

export const RequirementsView: React.FC<RequirementsViewProps> = ({
  requirement,
  currentUser,
  onSaveRequirement,
  onProceedToBOQ
}) => {
  const [formData, setFormData] = useState<CustomerRequirement>({ ...requirement });
  const [analyzingAI, setAnalyzingAI] = useState(false);
  const [aiResult, setAiResult] = useState<{
    structuredSummary: string;
    scopeContradictions: string[];
    missingMeasurementsAndGaps: string[];
    suggestedClarificationQuestions: string[];
    detectedLanguages: string[];
  } | null>(null);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // New room modal / row state
  const [newRoom, setNewRoom] = useState<Partial<RoomSpace>>({
    name: '',
    zone: 'Private Zone',
    floor: '14th Floor',
    lengthFt: 12,
    widthFt: 10,
    heightFt: 9.5,
    existingCondition: 'Bare shell',
    demolitionRequired: false
  });
  const [showAddRoom, setShowAddRoom] = useState(false);

  // Update room list
  const handleAddRoom = () => {
    if (!newRoom.name || !newRoom.lengthFt || !newRoom.widthFt) return;
    const l = Number(newRoom.lengthFt);
    const w = Number(newRoom.widthFt);
    const h = Number(newRoom.heightFt) || 9.5;
    const carpet = Number((l * w).toFixed(2));
    const perimeter = Number((2 * (l + w)).toFixed(2));
    const wall = Number((perimeter * h).toFixed(2));

    const created: RoomSpace = {
      id: `ROOM-${Date.now()}`,
      name: newRoom.name,
      zone: newRoom.zone || 'Living Zone',
      floor: newRoom.floor || '14th Floor',
      lengthFt: l,
      widthFt: w,
      heightFt: h,
      carpetAreaSqFt: carpet,
      perimeterFt: perimeter,
      wallAreaSqFt: wall,
      ceilingAreaSqFt: carpet,
      existingCondition: newRoom.existingCondition || 'Bare shell',
      demolitionRequired: !!newRoom.demolitionRequired,
      notes: newRoom.notes || ''
    };

    const updatedRooms = [...formData.rooms, created];
    const totalCarpet = updatedRooms.reduce((acc, r) => acc + r.carpetAreaSqFt, 0);

    const updated = {
      ...formData,
      rooms: updatedRooms,
      carpetAreaSqFt: totalCarpet
    };
    setFormData(updated);
    setShowAddRoom(false);
    setNewRoom({
      name: '',
      zone: 'Private Zone',
      floor: '14th Floor',
      lengthFt: 12,
      widthFt: 10,
      heightFt: 9.5,
      existingCondition: 'Bare shell',
      demolitionRequired: false
    });
  };

  const handleRemoveRoom = (roomId: string) => {
    const updatedRooms = formData.rooms.filter(r => r.id !== roomId);
    const totalCarpet = updatedRooms.reduce((acc, r) => acc + r.carpetAreaSqFt, 0);
    setFormData({
      ...formData,
      rooms: updatedRooms,
      carpetAreaSqFt: totalCarpet
    });
  };

  // Mock document upload handler
  const handleSimulateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    const newDoc: UploadedBriefDocument = {
      id: `DOC-${Date.now()}`,
      filename: file.name,
      fileType: file.type || 'application/pdf',
      sizeKb: Math.round(file.size / 1024) || 2450,
      uploadedAt: new Date().toISOString(),
      uploadedBy: currentUser.name,
      documentType: file.name.toLowerCase().includes('plan') ? 'FLOOR_PLAN_DRAWING' : 'CLIENT_BRIEF_PDF',
      version: 'v1.0',
      scaleConfirmed: true,
      scaleRatio: '1:100',
      notes: 'Uploaded and verified by site surveyor'
    };

    setFormData({
      ...formData,
      documents: [...formData.documents, newDoc]
    });
  };

  const handleSave = () => {
    onSaveRequirement(formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const runRequirementAgent = async () => {
    setAnalyzingAI(true);
    try {
      const res = await fetch('/api/ai/analyze-requirements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ requirement: formData })
      });
      const data = await res.json();
      setAiResult(data);
    } catch (err) {
      console.error('Failed to run AI analysis:', err);
    } finally {
      setAnalyzingAI(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & AI Action Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 rounded-xl border border-[#E5DFD7] bg-white p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="rounded bg-[#EFEAE2] px-2 py-0.5 text-xs font-bold text-[#554B3E]">
              STEP 2 OF 8
            </span>
            <span className="rounded bg-[#E8F3ED] px-2 py-0.5 text-xs font-semibold text-[#1C7346]">
              Verified Room Schedule & Takeoff Brief
            </span>
          </div>
          <h2 className="mt-2 font-serif text-xl font-bold text-[#1F2421]">
            Customer Requirements & Site Survey Studio
          </h2>
          <p className="mt-1 text-xs text-[#6B7280]">
            Guided multi-space dimensional capture, Hinglish brief translation, and scale-verified drawing takeoff.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            className="rounded-lg border border-[#D5CCC0] bg-[#FAF7F2] px-4 py-2 text-xs font-semibold text-[#3C362F] hover:bg-[#EFEAE2] transition"
          >
            {saveSuccess ? 'Saved to Database!' : 'Save Changes'}
          </button>
          <button
            onClick={runRequirementAgent}
            disabled={analyzingAI}
            className="flex items-center gap-1.5 rounded-lg bg-[#273034] px-4 py-2 text-xs font-semibold text-[#E0A96D] hover:bg-[#1B2225] transition shadow-xs disabled:opacity-50"
          >
            {analyzingAI ? (
              <>
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Analyzing Brief with AI...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5" />
                <span>Run AI Requirement Agent</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* AI Analysis Findings Display */}
      {aiResult && (
        <div className="rounded-xl border border-[#E0D3C1] bg-[#FCF9F5] p-5 shadow-xs transition">
          <div className="flex items-center justify-between border-b border-[#EDE4D6] pb-3">
            <div className="flex items-center gap-2">
              <div className="rounded-lg bg-[#273034] p-1.5 text-[#E0A96D]">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="font-serif text-sm font-bold text-[#1F2421]">
                AI Requirement Agent Findings & Quality Gate
              </h3>
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-[#7C5A26]">
              <Languages className="h-3.5 w-3.5" />
              <span>Languages: {aiResult.detectedLanguages.join(', ')}</span>
            </div>
          </div>

          <div className="mt-3 text-xs text-[#4F473E] leading-relaxed">
            <strong>Scope Summary:</strong> {aiResult.structuredSummary}
          </div>

          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Missing Dimensions & Gaps */}
            <div className="rounded-lg border border-[#F0D5C0] bg-[#FFF8F3] p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#964B00]">
                <AlertTriangle className="h-3.5 w-3.5" />
                <span>Missing Dimensions & Scope Gaps ({aiResult.missingMeasurementsAndGaps.length})</span>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-[#66380B]">
                {aiResult.missingMeasurementsAndGaps.map((gap, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <span>{gap}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Scope Contradictions & Clarifications */}
            <div className="rounded-lg border border-[#E2D4EB] bg-[#FAF5FC] p-3">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#6B21A8]">
                <HelpCircle className="h-3.5 w-3.5" />
                <span>Clarification Questions for Client ({aiResult.suggestedClarificationQuestions.length})</span>
              </div>
              <ul className="mt-2 space-y-1 text-xs text-[#581C87]">
                {aiResult.suggestedClarificationQuestions.map((q, i) => (
                  <li key={i} className="flex items-start gap-1.5">
                    <span className="font-bold">•</span>
                    <span>{q}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between border-t border-[#EDE4D6] pt-3">
            <span className="text-[11px] text-[#786D5F]">
              AI estimation check completed. Dimensions can now be converted into draft BOQ line items.
            </span>
            <button
              onClick={onProceedToBOQ}
              className="flex items-center gap-1.5 rounded-lg bg-[#273034] px-4 py-1.5 text-xs font-semibold text-[#E0A96D] hover:bg-[#1A2022] transition"
            >
              <span>Proceed to AI BOQ Takeoff</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {/* Grid: Left Column (Spaces & Dimensions), Right Column (Specs & Uploads) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Room Spaces & Dimensional Schedule */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-xl border border-[#E5DFD7] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-serif text-base font-bold text-[#1F2421]">
                  Room Spaces & Measurement Schedule
                </h3>
                <p className="text-xs text-[#6B7280]">
                  Exact dimensions used by deterministic formulas for false ceilings, tile flooring, and wall painting.
                </p>
              </div>
              <button
                onClick={() => setShowAddRoom(!showAddRoom)}
                className="flex items-center gap-1 rounded-lg border border-[#D5CCC0] bg-[#FAF7F2] px-3 py-1.5 text-xs font-semibold text-[#3C362F] hover:bg-[#F0EBE2] transition"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>Add Room</span>
              </button>
            </div>

            {/* Add Room Inline Form */}
            {showAddRoom && (
              <div className="mt-4 rounded-lg border border-[#E2DBD0] bg-[#FAF8F5] p-4 text-xs">
                <div className="font-semibold text-[#1F2421] mb-2">New Room / Zone Parameters</div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B7280]">Room Name</label>
                    <input
                      type="text"
                      value={newRoom.name}
                      onChange={e => setNewRoom({ ...newRoom, name: e.target.value })}
                      placeholder="e.g. Foyer / Powder Toilet"
                      className="mt-1 w-full rounded border border-[#D3C9BC] bg-white p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B7280]">Zone</label>
                    <input
                      type="text"
                      value={newRoom.zone}
                      onChange={e => setNewRoom({ ...newRoom, zone: e.target.value })}
                      className="mt-1 w-full rounded border border-[#D3C9BC] bg-white p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B7280]">Floor</label>
                    <input
                      type="text"
                      value={newRoom.floor}
                      onChange={e => setNewRoom({ ...newRoom, floor: e.target.value })}
                      className="mt-1 w-full rounded border border-[#D3C9BC] bg-white p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B7280]">Length (ft)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newRoom.lengthFt}
                      onChange={e => setNewRoom({ ...newRoom, lengthFt: parseFloat(e.target.value) || 0 })}
                      className="mt-1 w-full rounded border border-[#D3C9BC] bg-white p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B7280]">Width (ft)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newRoom.widthFt}
                      onChange={e => setNewRoom({ ...newRoom, widthFt: parseFloat(e.target.value) || 0 })}
                      className="mt-1 w-full rounded border border-[#D3C9BC] bg-white p-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-[#6B7280]">Height (ft)</label>
                    <input
                      type="number"
                      step="0.1"
                      value={newRoom.heightFt}
                      onChange={e => setNewRoom({ ...newRoom, heightFt: parseFloat(e.target.value) || 0 })}
                      className="mt-1 w-full rounded border border-[#D3C9BC] bg-white p-1.5 text-xs"
                    />
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <label className="flex items-center gap-1.5 text-xs text-[#524B40]">
                    <input
                      type="checkbox"
                      checked={newRoom.demolitionRequired}
                      onChange={e => setNewRoom({ ...newRoom, demolitionRequired: e.target.checked })}
                      className="rounded border-[#D3C9BC] text-[#273034]"
                    />
                    <span>Demolition of wall/tiles required in this room</span>
                  </label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => setShowAddRoom(false)}
                      className="rounded px-2.5 py-1 text-xs text-[#6B7280] hover:bg-[#EDE7DD]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAddRoom}
                      className="rounded bg-[#273034] px-3 py-1 text-xs font-semibold text-white hover:bg-[#1A2022]"
                    >
                      Add Room
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Rooms Table */}
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#EBE5DC] bg-[#FAF8F5] text-[11px] font-semibold text-[#6C6356]">
                    <th className="p-2.5">Room / Space</th>
                    <th className="p-2.5">Zone & Floor</th>
                    <th className="p-2.5">L × W × H (ft)</th>
                    <th className="p-2.5">Carpet Area</th>
                    <th className="p-2.5">Wall Area</th>
                    <th className="p-2.5">Existing Condition</th>
                    <th className="p-2.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#F2EDE5]">
                  {formData.rooms.map(room => (
                    <tr key={room.id} className="hover:bg-[#FAF9F7] transition">
                      <td className="p-2.5 font-semibold text-[#1F2421]">
                        {room.name}
                        {room.demolitionRequired && (
                          <span className="ml-1.5 rounded bg-[#FEE2E2] px-1.5 py-0.2 text-[9px] font-bold text-[#991B1B]">
                            Demolition
                          </span>
                        )}
                      </td>
                      <td className="p-2.5 text-[#5F574C]">{room.zone} ({room.floor})</td>
                      <td className="p-2.5 font-mono text-[11px] text-[#423C33]">
                        {room.lengthFt} × {room.widthFt} × {room.heightFt}
                      </td>
                      <td className="p-2.5 font-semibold text-[#1F2421]">
                        {room.carpetAreaSqFt} sq.ft
                      </td>
                      <td className="p-2.5 text-[#5F574C]">
                        {room.wallAreaSqFt} sq.ft
                      </td>
                      <td className="p-2.5 text-[#6B7280] truncate max-w-[150px]">
                        {room.existingCondition}
                      </td>
                      <td className="p-2.5 text-right">
                        <button
                          onClick={() => handleRemoveRoom(room.id)}
                          className="rounded p-1 text-[#9CA3AF] hover:bg-[#FEE2E2] hover:text-[#DC2626] transition"
                          title="Remove Room"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Total Area Summary */}
            <div className="mt-4 flex items-center justify-between border-t border-[#F0EBE3] pt-3 text-xs">
              <span className="text-[#6B7280]">
                Total Count: <strong>{formData.rooms.length} Spaces</strong>
              </span>
              <span className="text-sm font-bold text-[#1F2421]">
                Total Carpet Area: {formData.carpetAreaSqFt} sq.ft
              </span>
            </div>
          </div>

          {/* Hindi / Hinglish Multilingual Client Brief Input */}
          <div className="rounded-xl border border-[#E5DFD7] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="rounded-lg bg-[#FAF4EC] p-1.5 text-[#B87A38]">
                  <Languages className="h-4 w-4" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[#1F2421]">
                    Natural Language Client Brief (Hindi / Hinglish / English)
                  </h3>
                  <p className="text-xs text-[#6B7280]">
                    AI parses conversational vernacular briefs (e.g. &quot;Kitchen me acrylic shutters, living area me Kajaria tiles&quot;)
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-3">
              <textarea
                rows={4}
                value={formData.rawBriefHindiEnglish}
                onChange={e => setFormData({ ...formData, rawBriefHindiEnglish: e.target.value })}
                placeholder="Enter client instructions in English or Hinglish..."
                className="w-full rounded-lg border border-[#D3C9BC] bg-[#FCFBF9] p-3 text-xs text-[#2A2F33] focus:border-[#273034] focus:outline-hidden"
              />
            </div>
            <div className="mt-2 text-[11px] text-[#7A7369]">
              💡 Tip: Click &quot;Run AI Requirement Agent&quot; above to extract structured trade requirements and flag discrepancies from this brief.
            </div>
          </div>
        </div>

        {/* Right Column: Uploaded Drawings & Project Metadata */}
        <div className="space-y-6">
          {/* Document Uploads & Versioning */}
          <div className="rounded-xl border border-[#E5DFD7] bg-white p-6 shadow-xs">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-sm font-bold text-[#1F2421]">
                Drawings & Survey Documents
              </h3>
              <span className="text-[11px] text-[#6B7280]">{formData.documents.length} Files</span>
            </div>
            <p className="mt-1 text-xs text-[#6B7280]">
              Takeoff requires scale bar confirmation. Unscaled photos are tagged as provisional.
            </p>

            {/* Document List */}
            <div className="mt-4 space-y-2">
              {formData.documents.map(doc => (
                <div key={doc.id} className="rounded-lg border border-[#E7E1D8] bg-[#FAF8F5] p-3 text-xs">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-[#A86F37] shrink-0" />
                      <div>
                        <div className="font-semibold text-[#1F2421] truncate max-w-[170px]">{doc.filename}</div>
                        <div className="text-[10px] text-[#78716C]">
                          {doc.documentType} • {doc.sizeKb} KB
                        </div>
                      </div>
                    </div>
                    <span className="rounded bg-[#EFE9DF] px-1.5 py-0.5 text-[10px] font-bold text-[#4A4036]">
                      {doc.version}
                    </span>
                  </div>

                  <div className="mt-2 flex items-center justify-between border-t border-[#EDE7DD] pt-2 text-[10px]">
                    <span className="flex items-center gap-1 text-[#2E7D32]">
                      <CheckCircle2 className="h-3 w-3" />
                      Scale: {doc.scaleConfirmed ? doc.scaleRatio || 'Confirmed' : 'Unscaled Photo'}
                    </span>
                    <span className="text-[#8C847B]">Verified</span>
                  </div>
                </div>
              ))}
            </div>

            {/* Upload Simulator Button */}
            <div className="mt-4">
              <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-[#CFC5B7] bg-[#FAF9F7] p-4 text-center hover:bg-[#F2EDE5] transition">
                <UploadCloud className="h-6 w-6 text-[#8A7D6C]" />
                <span className="mt-1 text-xs font-semibold text-[#3C362F]">Upload Drawing / Brief</span>
                <span className="text-[10px] text-[#8A7D6C]">PDF, DWG, XLSX, or Survey JPEG</span>
                <input
                  type="file"
                  onChange={handleSimulateUpload}
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Project Details & Constraints Form */}
          <div className="rounded-xl border border-[#E5DFD7] bg-white p-6 shadow-xs text-xs space-y-3">
            <h3 className="font-serif text-sm font-bold text-[#1F2421] border-b border-[#F0EBE3] pb-2">
              Turnkey Project Parameters
            </h3>

            <div>
              <label className="block text-[11px] font-medium text-[#6B7280]">Project Scope</label>
              <select
                value={formData.projectScope}
                onChange={e => setFormData({ ...formData, projectScope: e.target.value as any })}
                className="mt-1 w-full rounded border border-[#D3C9BC] bg-white p-1.5 text-xs text-[#1F2421]"
              >
                <option value="TURNKEY_INTERIORS">Turnkey Interiors & Fitout</option>
                <option value="ARCHITECTURE_BUILD">Architecture & Civil Build</option>
                <option value="COMPLETE_RENOVATION">Complete Structural Renovation</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-[#6B7280]">Min Budget (₹)</label>
                <input
                  type="number"
                  value={formData.customerBudgetMin}
                  onChange={e => setFormData({ ...formData, customerBudgetMin: parseFloat(e.target.value) || 0 })}
                  className="mt-1 w-full rounded border border-[#D3C9BC] bg-white p-1.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium text-[#6B7280]">Max Budget (₹)</label>
                <input
                  type="number"
                  value={formData.customerBudgetMax}
                  onChange={e => setFormData({ ...formData, customerBudgetMax: parseFloat(e.target.value) || 0 })}
                  className="mt-1 w-full rounded border border-[#D3C9BC] bg-white p-1.5 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#6B7280]">Site Access & Society Rules</label>
              <textarea
                rows={2}
                value={formData.siteAccessConstraints}
                onChange={e => setFormData({ ...formData, siteAccessConstraints: e.target.value })}
                className="mt-1 w-full rounded border border-[#D3C9BC] bg-white p-1.5 text-xs"
              />
            </div>

            <div>
              <label className="block text-[11px] font-medium text-[#6B7280]">Exclusions / Client Supplied</label>
              <textarea
                rows={2}
                value={formData.exclusionsCustomerSupplied}
                onChange={e => setFormData({ ...formData, exclusionsCustomerSupplied: e.target.value })}
                className="mt-1 w-full rounded border border-[#D3C9BC] bg-white p-1.5 text-xs"
              />
            </div>

            <div className="pt-2">
              <button
                onClick={handleSave}
                className="w-full rounded-lg bg-[#273034] py-2 text-xs font-semibold text-white hover:bg-[#1A2022] transition"
              >
                Save Survey Parameters
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
