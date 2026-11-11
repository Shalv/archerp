/**
 * Build Storys ERP - AI FLOOR PLAN-TO-INTERIOR DESIGN STUDIO (M04-C)
 * -----------------------------------------------------------------
 * End-to-end workflow inside the ERP:
 *   1. Upload a floor plan (PDF/JPG/PNG/DWG/DXF) or enter dimensions
 *   2. Review the AI floor plan analysis (rooms, openings, flagged items)
 *   3. Capture the customer preference form (style, budget, palette, ...)
 *   4. Generate 3-5 room-wise design concepts from the SAME plan
 *   5. Compare, comment, revise one room or the whole concept, approve
 *   6. Convert the approved concept into a room-wise BOQ
 *
 * The geometry model is the contract between every step: a concept can only
 * use measured rooms, and the BOQ can only use confirmed dimensions.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  Upload,
  Ruler,
  ScanLine,
  SlidersHorizontal,
  Sparkles,
  GitCompare,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Printer,
  Download,
  RefreshCw,
  Plus,
  X,
  Lock,
  MessageSquare,
  ArrowRight,
  Loader2,
  Layers,
  Palette,
  IndianRupee,
  History
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../../types/erp';
import { apiJson, ApiUnavailableError, isApiUnavailable } from '../../utils/apiClient';
import { VILLA253_MEDIA_LIBRARY } from '../../data/villa253MediaLibrary';

import {
  BudgetBand,
  ColourPalette,
  DesignConcept,
  DesignPreferences,
  DesignStudioSession,
  FloorPlanSourceKind,
  FlooringPreference,
  FurniturePreference,
  KitchenLayout,
  LightingPreference,
  PropertyType,
  RoomInstruction,
  SpecialRequirement,
  StoragePreference,
  StylePreference
} from '../../types/designStudio';

interface Props {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
}

const STEPS = [
  { key: 'upload', label: '1. Floor plan', icon: Upload },
  { key: 'analysis', label: '2. AI analysis', icon: ScanLine },
  { key: 'preferences', label: '3. Preferences', icon: SlidersHorizontal },
  { key: 'concepts', label: '4. Concepts', icon: Sparkles },
  { key: 'review', label: '5. Select & approve', icon: GitCompare },
  { key: 'boq', label: '6. Design → BOQ', icon: IndianRupee }
] as const;

const STYLE_OPTIONS: { value: StylePreference; label: string }[] = [
  { value: 'MODERN', label: 'Modern' },
  { value: 'CONTEMPORARY', label: 'Contemporary' },
  { value: 'MINIMALIST', label: 'Minimalist' },
  { value: 'LUXURY', label: 'Luxury' },
  { value: 'SCANDINAVIAN', label: 'Scandinavian' },
  { value: 'INDUSTRIAL', label: 'Industrial' },
  { value: 'TRADITIONAL_INDIAN', label: 'Traditional Indian' }
];

const inr = (n: number) =>
  n >= 10000000
    ? `₹${(n / 10000000).toFixed(2)} Cr`
    : n >= 100000
      ? `₹${(n / 100000).toFixed(2)} L`
      : `₹${Math.round(n).toLocaleString('en-IN')}`;

const statusChip = (status: string) => {
  const map: Record<string, string> = {
    APPROVED: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    SELECTED: 'bg-blue-50 text-[#0F6CBD] border-blue-200',
    PRESENTED: 'bg-slate-50 text-slate-600 border-slate-200',
    REJECTED: 'bg-rose-50 text-rose-700 border-rose-200',
    REVISION_REQUESTED: 'bg-amber-50 text-amber-700 border-amber-200',
    DRAFT: 'bg-slate-50 text-slate-500 border-slate-200'
  };
  return map[status] || 'bg-slate-50 text-slate-600 border-slate-200';
};

export const AIDesignStudioView: React.FC<Props> = ({ project, currentUser, onNavigateTab }) => {
  const [session, setSession] = useState<DesignStudioSession | null>(null);
  const [step, setStep] = useState<string>('upload');
  const [busy, setBusy] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [notice, setNotice] = useState<string>('');

  // step 1 state
  const [sourceKind, setSourceKind] = useState<FloorPlanSourceKind>('DXF');
  const [fileName, setFileName] = useState<string>(project.requirement?.documents?.[0]?.filename || '');
  const [manualRooms, setManualRooms] = useState<
    { name: string; lengthFt: string; widthFt: string; ceilingHeightFt: string }[]
  >([
    { name: 'Living Room', lengthFt: '', widthFt: '', ceilingHeightFt: '10.25' },
    { name: 'Master Bedroom', lengthFt: '', widthFt: '', ceilingHeightFt: '10.25' },
    { name: 'Kitchen', lengthFt: '', widthFt: '', ceilingHeightFt: '10.25' }
  ]);

  // step 3 state
  const [prefs, setPrefs] = useState<DesignPreferences>({
    propertyType: 'VILLA',
    carpetAreaSqFt: project.carpetAreaSqFt || 0,
    style: 'LUXURY',
    budgetBand: 'PREMIUM',
    palette: 'WARM',
    flooring: 'MARBLE',
    furniture: 'CUSTOM',
    kitchenLayout: 'L_SHAPED',
    lighting: ['AMBIENT', 'ACCENT'],
    storage: 'MAXIMUM',
    specialRequirements: [],
    roomInstructions: []
  });
  const [conceptCount, setConceptCount] = useState(4);
  const [selectedConceptId, setSelectedConceptId] = useState<string>('');
  const [planFile, setPlanFile] = useState<File | null>(null);
  const [ocrText, setOcrText] = useState<string>('');
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [aiStatus, setAiStatus] = useState<{ configured: boolean; textModel: string; imageModel: string; note: string } | null>(null);
  const [aiBusy, setAiBusy] = useState<string>('');
  const [aiProgress, setAiProgress] = useState<{ done: number; total: number; label: string }>({ done: 0, total: 0, label: '' });
  const [aiConfirm, setAiConfirm] = useState<DesignConcept | null>(null);
  const [revisionTarget, setRevisionTarget] = useState<DesignConcept | null>(null);
  const [revisionForm, setRevisionForm] = useState({
    scope: 'WHOLE_CONCEPT' as 'WHOLE_CONCEPT' | 'ROOM',
    roomId: '',
    changeType: 'COLOUR_ONLY',
    instruction: ''
  });

  const api = async (path: string, method: string, body?: any) =>
    apiJson<DesignStudioSession>(`/api/design-studio/${project.id}${path}`, {
      method,
      body: body ? JSON.stringify(body) : undefined
    });

  const run = async (label: string, fn: () => Promise<DesignStudioSession | void>) => {
    setBusy(label);
    setError('');
    setNotice('');
    try {
      const next = await fn();
      if (next) setSession(next);
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
    } finally {
      setBusy('');
    }
  };

  useEffect(() => {
    run('load', async () => {
      const data = await apiJson<DesignStudioSession>(`/api/design-studio/${project.id}`).catch(err => {
        if (isApiUnavailable(err)) setError(err.message);
        return null;
      });
      if (!data?.projectId) return;
      setSession(data);
      if (data.preferences) setPrefs(data.preferences);
      if (data.model) {
        // Land on the concept comparison when concepts exist - that is the screen
        // a client actually reviews - and let the stepper walk back through 1-3.
        setStep(data.concepts?.length ? 'review' : 'analysis');
      }
    });
    apiJson<any>('/api/ai/status').then(setAiStatus).catch(() => setAiStatus(null));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const model = session?.model;
  const concepts = session?.concepts || [];
  const approved = concepts.find(c => c.id === session?.approvedConceptId);
  const focusConcept = concepts.find(c => c.id === (selectedConceptId || session?.selectedConceptId || session?.approvedConceptId)) || concepts[0];

  const stepDone = useMemo(
    () => ({
      upload: !!model,
      analysis: !!model?.confirmedAt,
      preferences: !!session?.preferences?.updatedAt,
      concepts: concepts.length > 0,
      review: !!session?.approvedConceptId,
      boq: !!session?.boqDraft
    }),
    [model, session, concepts.length]
  );

  // ---------------------------------------------------------------- step 1
  const submitFloorPlan = () =>
    run('floor-plan', async () => {
      const roomsFromRequirement = (project.requirement?.rooms || []).map(r => ({
        id: r.id,
        name: r.name,
        floor: r.floor,
        lengthFt: r.lengthFt,
        widthFt: r.widthFt,
        ceilingHeightFt: r.heightFt,
        confidence: 'CAD_EXTRACTED' as const
      }));
      const rooms =
        roomsFromRequirement.length > 0
          ? roomsFromRequirement
          : manualRooms
              .filter(r => r.name && Number(r.lengthFt) > 0 && Number(r.widthFt) > 0)
              .map(r => ({
                name: r.name,
                lengthFt: Number(r.lengthFt),
                widthFt: Number(r.widthFt),
                ceilingHeightFt: Number(r.ceilingHeightFt) || 10.25,
                confidence: 'USER_VERIFIED' as const
              }));
      if (rooms.length === 0) {
        throw new Error('Add at least one room with length and width, or capture rooms in the Site Survey module first.');
      }
      const next = await api('/floor-plan', 'POST', {
        kind: sourceKind,
        fileName: fileName || undefined,
        scaleRatio: '1:100',
        rooms,
        analysisNotes:
          roomsFromRequirement.length > 0
            ? ['Room dimensions pre-filled from the project requirement / site survey record.']
            : ['Room dimensions entered manually in the studio.']
      });
      setStep('analysis');
      return next;
    });

  // ---------------------------------------------------------------- step 2
  const confirmModel = () =>
    run('confirm-model', async () => {
      const next = await api('/model', 'PUT', {
        rooms: (model?.rooms || []).map(r => ({
          id: r.id,
          lengthFt: r.lengthFt,
          widthFt: r.widthFt,
          ceilingHeightFt: r.ceilingHeightFt
        })),
        uncertainItems: []
      });
      setStep('preferences');
      setNotice('Floor plan model confirmed. Quantities are now locked to these dimensions.');
      return next;
    });

  // ---------------------------------------------------------------- step 3
  const savePreferences = () =>
    run('preferences', async () => {
      const next = await api('/preferences', 'PUT', prefs);
      setNotice('Preferences saved as design constraints.');
      return next;
    });

  const generate = () =>
    run('generate', async () => {
      await api('/preferences', 'PUT', prefs);
      const next = await api('/generate', 'POST', { count: conceptCount });
      setStep('concepts');
      setNotice(`${next.concepts.length} concepts generated from the same floor plan.`);
      return next;
    });

  // ---------------------------------------------------------------- step 5
  const selectConcept = (id: string) =>
    run('select', async () => {
      setSelectedConceptId(id);
      return api(`/concepts/${id}/select`, 'POST');
    });

  const approveConcept = (id: string) =>
    run('approve', async () => {
      const next = await api(`/concepts/${id}/approve`, 'POST');
      setNotice('Design approved and all room schemes locked. You can now generate the BOQ.');
      setStep('boq');
      return next;
    });

  const submitRevision = () =>
    run('revision', async () => {
      if (!revisionTarget) return;
      const next = await api(`/concepts/${revisionTarget.id}/revision`, 'POST', {
        instruction: revisionForm.instruction,
        scope: revisionForm.scope,
        roomId: revisionForm.roomId,
        changeType: revisionForm.changeType
      });
      setRevisionTarget(null);
      setRevisionForm({ scope: 'WHOLE_CONCEPT', roomId: '', changeType: 'COLOUR_ONLY', instruction: '' });
      setNotice('Revision applied. The concept version and cost have been updated.');
      return next;
    });

  // ---------------------------------------------------------------- step 6
  const generateBOQ = () =>
    run('boq', async () => {
      const next = await api('/generate-boq', 'POST', {
        conceptId: session?.approvedConceptId,
        applyToProject: true
      });
      setNotice('Room-wise BOQ created and attached to the project as a new revision.');
      return next;
    });

  /** Hands the approved design to the Project Design Digital Twin (design freeze). */
  const handoffToTwin = () =>
    run('handoff', async () => {
      const result = await apiJson<any>(`/api/design-studio/${project.id}/handoff-to-twin`, {
        method: 'POST',
        body: JSON.stringify({ force: true })
      });
      setNotice(
        `Design frozen and handed to the twin: ${result.twin.rooms.length} rooms, ${result.twin.assets.length} assets at ${result.twin.designVersion}. Open Project Design Digital Twin to review the drawing package.`
      );
      onNavigateTab?.('design_twin');
    });

  const openPresentation = async () => {
    setBusy('presentation');
    setError('');
    try {
      const pack = await apiJson<any>(`/api/design-studio/${project.id}/presentation`);
      const win = window.open('', '_blank');
      if (!win) throw new Error('Allow pop-ups to open the client presentation.');
      win.document.write(buildPresentationHtml(pack, project));
      win.document.close();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy('');
    }
  };

  // ---------------------------------------------------------------- Gemini AI
  /** Reads the uploaded plan with Gemini (server-side vision), then sends ONLY
   *  the extracted rooms through the same model + confirmation gate as a manual
   *  entry. The API key stays on the server. */
  const readPlanWithAI = () =>
    run('ai-ocr', async () => {
      if (!planFile) throw new Error('Choose a floor plan file first (PDF, JPG or PNG).');
      setAiBusy('ocr');
      setAiProgress({ done: 0, total: 2, label: 'Sending the sheet to Gemini' });
      try {
        const base64 = await fileToBase64(planFile);
        setAiProgress({ done: 1, total: 2, label: 'Gemini is reading the plan' });
        const extracted = await apiJson<any>('/api/ai/studio/extract-plan', {
          method: 'POST',
          body: JSON.stringify({
            base64,
            mimeType: planFile.type || mimeTypeFor(planFile.name),
            fileName: planFile.name
          })
        });
        setOcrText(extracted.rawText || '');
        if (!extracted.rooms?.length) {
          throw new Error('No dimensioned rooms were found on that sheet. Enter the room table manually, or upload a plan with printed dimensions.');
        }
        const ext = planFile.name.split('.').pop()?.toUpperCase() || 'PDF';
        const next = await api('/floor-plan', 'POST', {
          kind: (['PDF', 'JPG', 'PNG', 'DWG', 'DXF'].includes(ext) ? ext : 'PDF') as FloorPlanSourceKind,
          fileName: planFile.name,
          sizeKb: Math.round(planFile.size / 1024),
          rooms: extracted.rooms.map((r: any) => ({
            name: r.name,
            lengthFt: r.lengthFt,
            widthFt: r.widthFt,
            ceilingHeightFt: r.ceilingHeightFt,
            floor: r.floor,
            notes: r.notes,
            confidence: 'AI_INFERRED' as const
          })),
          aiExtraction: {
            engine: 'Gemini',
            model: extracted.model,
            ocrCharacters: String(extracted.rawText || '').length,
            confidenceNotes: extracted.confidenceNotes || []
          }
        });
        setStep('analysis');
        setNotice(
          `Gemini read ${extracted.rooms.length} rooms from the sheet` +
            (extracted.confidenceNotes?.length ? `, with ${extracted.confidenceNotes.length} item(s) to confirm` : '') +
            '. Confirm every dimension before generating concepts.'
        );
        return next;
      } finally {
        setAiBusy('');
        setAiProgress({ done: 0, total: 0, label: '' });
      }
    });

  /** Generates the narrative and/or room renders with Gemini (server-side),
   *  then stores them against the concept. Quantities and rates are untouched. */
  const runAIGenerate = async (concept: DesignConcept, options: { renders: boolean; narrative: boolean; maxRooms?: number }) => {
    setAiConfirm(null);
    setBusy('ai-generate');
    setError('');
    setNotice('');
    setAiProgress({ done: 0, total: options.renders ? options.maxRooms || 4 : 1, label: 'Gemini is working' });
    try {
      const result = await apiJson<any>(`/concepts/${concept.id}/ai-generate`, {
        method: 'POST',
        body: JSON.stringify({
          narrative: options.narrative,
          renderRoomIds: options.renders ? concept.roomSchemes.slice(0, options.maxRooms || 4).map(r => r.roomId) : [],
          maxRenders: options.maxRooms || 4
        })
      });
      setSession(result.session);
      setNotice(
        `Gemini saved ${result.renders || 0} render(s)${result.narrative ? ' and a new narrative' : ''}` +
          (result.narrativeSanitised ? ' (price references removed)' : '') +
          (result.failures?.length ? ` · ${result.failures.length} item(s) failed: ${result.failures[0]}` : '')
      );
    } catch (e: any) {
      setError(e?.message || 'The Gemini request failed.');
    } finally {
      setBusy('');
      setAiBusy('');
      setAiProgress({ done: 0, total: 0, label: '' });
    }
  };

  // ---------------------------------------------------------------- render
  return (
    <div className="space-y-4">
      {/* header */}
      <div className="bg-white border border-[#d2d0ce] rounded shadow-xs p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#0F6CBD] text-white text-[10px] font-bold px-2 py-0.5 rounded">M04-C</span>
              <h1 className="text-base font-bold text-slate-900">AI Floor Plan → Interior Design Studio</h1>
              <span className="text-[11px] text-slate-500">Stage 2 • Survey &amp; Design</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Upload a floor plan → AI reads the space → generate 3-5 room-wise concepts → customer selects →
              detailed design → BOQ. Geometry stays locked to the measured plan at every step.
            </p>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <span
              className={`inline-flex items-center gap-1 rounded border px-2 py-1 text-[10px] font-semibold ${
                aiStatus?.configured
                  ? 'bg-blue-50 text-[#0F6CBD] border-blue-200'
                  : 'bg-slate-50 text-slate-500 border-slate-200'
              }`}
              title={aiStatus?.note || 'Checking Gemini availability…'}
            >
              <Sparkles className="w-3 h-3" />
              {aiStatus?.configured ? `Gemini · ${aiStatus.textModel}` : 'Gemini not configured'}
            </span>
            <span className="text-slate-500">{project.projectCode}</span>
            <button
              onClick={openPresentation}
              disabled={!concepts.length || busy === 'presentation'}
              className="inline-flex items-center gap-1.5 border border-slate-300 rounded px-2.5 py-1.5 hover:bg-slate-50 disabled:opacity-40"
            >
              <Printer className="w-3.5 h-3.5" /> Client presentation
            </button>
            <button
              onClick={() => run('load', async () => {
                const data = await apiJson<DesignStudioSession>(`/api/design-studio/${project.id}`).catch(err => {
                  if (isApiUnavailable(err)) setError(err.message);
                  return null;
                });
                if (data?.projectId) setSession(data);
              })}
              className="inline-flex items-center gap-1.5 border border-slate-300 rounded px-2.5 py-1.5 hover:bg-slate-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${busy === 'load' ? 'animate-spin' : ''}`} /> Refresh
            </button>
          </div>
        </div>

        {/* stepper */}
        <div className="mt-3 flex items-center gap-1.5 overflow-x-auto pb-1">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            const done = (stepDone as any)[s.key];
            const active = step === s.key;
            return (
              <React.Fragment key={s.key}>
                <button
                  onClick={() => setStep(s.key)}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded text-[11px] border transition ${
                    active
                      ? 'bg-[#002050] text-white border-[#002050] font-semibold'
                      : done
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {done && !active ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Icon className="w-3.5 h-3.5" />}
                  {s.label}
                </button>
                {i < STEPS.length - 1 && <ArrowRight className="w-3 h-3 text-slate-300 shrink-0" />}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {error && (
        <div className="bg-rose-50 border border-rose-200 text-rose-800 text-xs rounded p-3">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
          {/reachable|non-JSON|API route/i.test(error) && (
            <div className="mt-2 pl-6">
              <button
                onClick={() =>
                  apiJson<any>('/api/system/diagnostics')
                    .then(setDiagnostics)
                    .catch(err => setDiagnostics({ error: err.message }))
                }
                className="text-[11px] font-semibold text-rose-800 underline"
              >
                Run server diagnostics
              </button>
              {diagnostics && (
                <pre className="mt-1 max-h-40 overflow-auto bg-white border border-rose-200 rounded p-2 text-[10px] text-slate-700 whitespace-pre-wrap">
{diagnostics.error
  ? `Diagnostics also failed: ${diagnostics.error}`
  : [
      `build: ${diagnostics.build?.commit} · ${diagnostics.build?.nodeEnv} · serverless=${diagnostics.build?.serverless}`,
      `database: ${diagnostics.database?.source}${diagnostics.database?.sizeKb ? ` (${diagnostics.database.sizeKb} KB)` : ''} · projects=${(diagnostics.database?.projects || []).join(', ')}`,
      `studio sessions: ${(diagnostics.database?.studioSessions || []).length} · twins: ${(diagnostics.database?.designTwins || []).length}`,
      `ai: ${diagnostics.ai?.provider} configured=${diagnostics.ai?.configured} (${diagnostics.ai?.textModel})`,
      ...(diagnostics.checks || []).map((c: any) => `${c.ok ? 'OK  ' : 'FAIL'} ${c.id}: ${c.detail}`),
      ...(diagnostics.recentErrors || []).slice(0, 3).map((e: any) => `error ${e.at} ${e.path}: ${e.message}`)
    ].join('\n')}
                </pre>
              )}
            </div>
          )}
        </div>
      )}
      {notice && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded p-3 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>{notice}</span>
        </div>
      )}

      {/* ------------------------------------------------------- STEP 1 */}
      {step === 'upload' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          <div className="lg:col-span-3 bg-white border border-slate-200 rounded p-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#0F6CBD]" /> Project drawings &amp; images ({VILLA253_MEDIA_LIBRARY.length})
              </h3>
              <p className="text-[11px] text-slate-500">
                Every visual the studio is allowed to use. Nothing is stock - each item is the project's own drawing or render.
              </p>
            </div>
            <div className="mt-2 grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-2">
              {VILLA253_MEDIA_LIBRARY.map(media => (
                <a
                  key={media.id}
                  href={media.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group border border-slate-200 rounded overflow-hidden hover:border-[#0F6CBD]"
                  title={`${media.title} — ${media.description}`}
                >
                  <div className="h-16 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {media.kind === 'CAD_DRAWING' && media.url.endsWith('.pdf') ? (
                      <FileText className="w-5 h-5 text-slate-400" />
                    ) : (
                      <img src={media.url} alt={media.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-1">
                    <div className="text-[8px] uppercase tracking-wide text-slate-400">{media.kind.replace('_', ' ')}</div>
                    <div className="text-[9px] text-slate-700 leading-tight line-clamp-2">{media.title}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-4 space-y-3">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#0F6CBD]" /> Upload the floor plan
            </h2>
            <p className="text-xs text-slate-500">
              PDF, JPG and PNG plans are read with OCR + geometry detection. DWG and DXF are read layer-wise
              (walls, doors, windows, stair, decks). If a sheet has no printed dimensions, confirm the room table
              before any concept is generated.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {(['PDF', 'JPG', 'PNG', 'DWG', 'DXF', 'MANUAL_DIMENSIONS'] as FloorPlanSourceKind[]).map(kind => (
                <button
                  key={kind}
                  onClick={() => setSourceKind(kind)}
                  className={`text-[11px] rounded border px-2 py-2 text-left ${
                    sourceKind === kind ? 'border-[#0F6CBD] bg-blue-50 text-[#0F6CBD] font-semibold' : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {kind === 'MANUAL_DIMENSIONS' ? 'Enter dimensions' : `${kind} plan`}
                </button>
              ))}
            </div>
            <div className="border border-dashed border-slate-300 rounded p-3 bg-slate-50/60">
              <input
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,.dwg,.dxf"
                onChange={e => {
                  const f = e.target.files?.[0];
                  if (!f) return;
                  setPlanFile(f);
                  setFileName(f.name);
                  const ext = f.name.split('.').pop()?.toUpperCase() || '';
                  setSourceKind((['PDF', 'JPG', 'PNG', 'DWG', 'DXF'].includes(ext) ? ext : 'PDF') as FloorPlanSourceKind);
                }}
                className="text-xs"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                {fileName ? `Selected: ${fileName}` : 'No file selected - you can still proceed using the measured room table.'}
              </p>
              {aiProgress.total > 0 && (
                <p className="text-[11px] text-violet-700 mt-1 inline-flex items-center gap-1.5">
                  <Loader2 className="w-3 h-3 animate-spin" />
                  Gemini: {aiProgress.label} ({aiProgress.done}/{aiProgress.total})
                </p>
              )}
              {ocrText && (
                <details className="mt-2">
                  <summary className="text-[11px] text-slate-600 cursor-pointer">OCR text read from the sheet ({ocrText.length} characters)</summary>
                  <pre className="mt-1 max-h-32 overflow-auto bg-white border border-slate-200 rounded p-2 text-[10px] whitespace-pre-wrap">{ocrText.slice(0, 2000)}</pre>
                </details>
              )}
            </div>
            <div className="flex items-center justify-between pt-1">
              <p className="text-[11px] text-slate-500">
                Rooms available from the project: <b>{project.requirement?.rooms?.length || 0}</b>
                {project.requirement?.rooms?.length ? ' (used automatically)' : ' (add them below)'}
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={readPlanWithAI}
                  disabled={!planFile || aiBusy === 'ocr' || !aiStatus?.configured}
                  title={
                    aiStatus?.configured
                      ? 'Read the uploaded sheet with Gemini (server-side vision + structured room extraction)'
                      : 'Gemini is not configured on the server (GEMINI_API_KEY)'
                  }
                  className="inline-flex items-center gap-1.5 bg-[#0F6CBD] text-white text-xs font-semibold rounded px-3 py-2 disabled:opacity-40"
                >
                  {aiBusy === 'ocr' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                  Read plan with AI
                </button>
                <button
                  onClick={submitFloorPlan}
                  disabled={busy === 'floor-plan'}
                  className="inline-flex items-center gap-1.5 bg-[#0F6CBD] text-white text-xs font-semibold rounded px-3 py-2 disabled:opacity-50"
                >
                  {busy === 'floor-plan' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ScanLine className="w-3.5 h-3.5" />}
                  Analyse floor plan
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-4 space-y-2">
            <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Ruler className="w-4 h-4 text-[#0F6CBD]" /> Or enter room dimensions
            </h3>
            <p className="text-[11px] text-slate-500">Used when no plan is uploaded. Length × width in feet.</p>
            {manualRooms.map((room, idx) => (
              <div key={idx} className="grid grid-cols-12 gap-1.5 items-center">
                <input
                  value={room.name}
                  onChange={e => setManualRooms(manualRooms.map((r, i) => (i === idx ? { ...r, name: e.target.value } : r)))}
                  placeholder="Room name"
                  className="col-span-5 border border-slate-300 rounded px-1.5 py-1 text-[11px]"
                />
                <input
                  value={room.lengthFt}
                  onChange={e => setManualRooms(manualRooms.map((r, i) => (i === idx ? { ...r, lengthFt: e.target.value } : r)))}
                  placeholder="L"
                  className="col-span-2 border border-slate-300 rounded px-1.5 py-1 text-[11px]"
                />
                <input
                  value={room.widthFt}
                  onChange={e => setManualRooms(manualRooms.map((r, i) => (i === idx ? { ...r, widthFt: e.target.value } : r)))}
                  placeholder="W"
                  className="col-span-2 border border-slate-300 rounded px-1.5 py-1 text-[11px]"
                />
                <input
                  value={room.ceilingHeightFt}
                  onChange={e => setManualRooms(manualRooms.map((r, i) => (i === idx ? { ...r, ceilingHeightFt: e.target.value } : r)))}
                  placeholder="H"
                  className="col-span-2 border border-slate-300 rounded px-1.5 py-1 text-[11px]"
                />
                <button
                  onClick={() => setManualRooms(manualRooms.filter((_, i) => i !== idx))}
                  className="col-span-1 text-slate-400 hover:text-rose-600"
                  aria-label="Remove room"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            <button
              onClick={() => setManualRooms([...manualRooms, { name: '', lengthFt: '', widthFt: '', ceilingHeightFt: '10.25' }])}
              className="inline-flex items-center gap-1 text-[11px] text-[#0F6CBD] font-semibold"
            >
              <Plus className="w-3 h-3" /> Add room
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- STEP 2 */}
      {step === 'analysis' && model && (
        <div className="space-y-3">
          <div className="bg-white border border-slate-200 rounded p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <ScanLine className="w-4 h-4 text-[#0F6CBD]" /> Floor plan analysis
              </h2>
              <div className="flex items-center gap-2 text-[11px] text-slate-600">
                <span className="px-2 py-1 rounded bg-slate-100">{model.source.kind}</span>
                {model.source.fileName && <span className="font-mono">{model.source.fileName}</span>}
                <span className="px-2 py-1 rounded bg-slate-100">{model.scaleRatio || 'scale not stated'}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 mt-3">
              {[
                ['Rooms', model.rooms.length],
                ['Carpet', `${model.totalCarpetSqFt} sq.ft`],
                ['Doors', model.doorsDetected],
                ['Windows / sliders', model.windowsDetected],
                ['Columns', model.columnsDetected || '—'],
                ['Circulation', `${model.circulationSqFt} sq.ft`]
              ].map(([label, value]) => (
                <div key={String(label)} className="border border-slate-200 rounded p-2">
                  <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
                  <div className="text-sm font-bold text-slate-900">{value}</div>
                </div>
              ))}
            </div>
            {model.analysisNotes.length > 0 && (
              <ul className="mt-3 space-y-1">
                {model.analysisNotes.map((note, i) => (
                  <li key={i} className="text-[11px] text-slate-600 flex gap-1.5">
                    <Layers className="w-3 h-3 mt-0.5 shrink-0 text-slate-400" /> {note}
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded overflow-hidden">
            <table className="w-full text-[11px]">
              <thead className="bg-slate-50 text-slate-600">
                <tr>
                  <th className="text-left p-2">Room</th>
                  <th className="text-left p-2">Floor</th>
                  <th className="text-right p-2">L × W</th>
                  <th className="text-right p-2">Area</th>
                  <th className="text-right p-2">Perimeter</th>
                  <th className="text-right p-2">Wall area</th>
                  <th className="text-left p-2">Openings</th>
                  <th className="text-left p-2">Confidence</th>
                </tr>
              </thead>
              <tbody>
                {model.rooms.map(room => (
                  <tr key={room.id} className="border-t border-slate-100">
                    <td className="p-2 font-medium text-slate-800">{room.name}</td>
                    <td className="p-2 text-slate-500">{room.floor}</td>
                    <td className="p-2 text-right">{room.lengthFt}' × {room.widthFt}'</td>
                    <td className="p-2 text-right">{room.areaSqFt} sq.ft</td>
                    <td className="p-2 text-right">{room.perimeterFt}'</td>
                    <td className="p-2 text-right">{room.wallAreaSqFt} sq.ft</td>
                    <td className="p-2 text-slate-500">{room.openings.map(o => o.code).join(', ') || '—'}</td>
                    <td className="p-2">
                      <span
                        className={`px-1.5 py-0.5 rounded border text-[10px] ${
                          room.confidence === 'CAD_EXTRACTED' || room.confidence === 'SITE_MEASURED'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-amber-50 text-amber-700 border-amber-200'
                        }`}
                      >
                        {room.confidence.replace('_', ' ')}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {model.uncertainItems.length > 0 && (
            <div className="bg-amber-50 border border-amber-200 rounded p-3">
              <h3 className="text-xs font-bold text-amber-900 flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> {model.uncertainItems.length} item(s) need confirmation before pricing
              </h3>
              <ul className="mt-1.5 space-y-1">
                {model.uncertainItems.map((item, i) => (
                  <li key={i} className="text-[11px] text-amber-800">• {item}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex items-center justify-between bg-white border border-slate-200 rounded p-3">
            <p className="text-[11px] text-slate-500">
              {model.confirmedAt
                ? `Confirmed by ${model.confirmedBy} on ${new Date(model.confirmedAt).toLocaleString('en-IN')}`
                : 'Confirm the room table to lock the quantities used by concepts and the BOQ.'}
            </p>
            <button
              onClick={confirmModel}
              disabled={busy === 'confirm-model'}
              className="inline-flex items-center gap-1.5 bg-[#0F6CBD] text-white text-xs font-semibold rounded px-3 py-2 disabled:opacity-50"
            >
              {busy === 'confirm-model' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
              Confirm model &amp; continue
            </button>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- STEP 3 */}
      {step === 'preferences' && (
        <div className="bg-white border border-slate-200 rounded p-4 space-y-3">
          <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-[#0F6CBD]" /> Customer preference form
          </h2>
          <p className="text-[11px] text-slate-500">
            Structured inputs only - the engine uses these as hard constraints, not as a free-text prompt.
            {model && <> Floor plan: <b>{model.totalCarpetSqFt} sq.ft</b> across {model.rooms.length} rooms.</>}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            <Field label="Property type">
              <select value={prefs.propertyType} onChange={e => setPrefs({ ...prefs, propertyType: e.target.value as PropertyType })} className="input">
                <option value="APARTMENT">Apartment</option>
                <option value="VILLA">Villa</option>
                <option value="INDEPENDENT_HOUSE">Independent house</option>
                <option value="OFFICE">Office</option>
              </select>
            </Field>
            <Field label="Carpet / built-up area (sq.ft)">
              <input type="number" value={prefs.carpetAreaSqFt} onChange={e => setPrefs({ ...prefs, carpetAreaSqFt: Number(e.target.value) })} className="input" />
            </Field>
            <Field label="Interior style">
              <select value={prefs.style} onChange={e => setPrefs({ ...prefs, style: e.target.value as StylePreference })} className="input">
                {STYLE_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </Field>
            <Field label="Budget band">
              <select value={prefs.budgetBand} onChange={e => setPrefs({ ...prefs, budgetBand: e.target.value as BudgetBand })} className="input">
                {['ECONOMY', 'STANDARD', 'PREMIUM', 'LUXURY', 'CUSTOM'].map(b => <option key={b} value={b}>{b.charAt(0) + b.slice(1).toLowerCase()}</option>)}
              </select>
            </Field>
            {prefs.budgetBand === 'CUSTOM' && (
              <Field label="Custom budget (₹)">
                <input type="number" value={prefs.customBudgetINR || ''} onChange={e => setPrefs({ ...prefs, customBudgetINR: Number(e.target.value) })} className="input" />
              </Field>
            )}
            <Field label="Colour palette">
              <select value={prefs.palette} onChange={e => setPrefs({ ...prefs, palette: e.target.value as ColourPalette })} className="input">
                {['WARM', 'NEUTRAL', 'EARTHY', 'MONOCHROME', 'CUSTOM'].map(p => <option key={p} value={p}>{p.charAt(0) + p.slice(1).toLowerCase()}</option>)}
              </select>
            </Field>
            <Field label="Flooring">
              <select value={prefs.flooring} onChange={e => setPrefs({ ...prefs, flooring: e.target.value as FlooringPreference })} className="input">
                {['MARBLE', 'TILES', 'WOODEN', 'VINYL'].map(f => <option key={f} value={f}>{f.charAt(0) + f.slice(1).toLowerCase()}</option>)}
              </select>
            </Field>
            <Field label="Furniture">
              <select value={prefs.furniture} onChange={e => setPrefs({ ...prefs, furniture: e.target.value as FurniturePreference })} className="input">
                {['READYMADE', 'MODULAR', 'CUSTOM'].map(f => <option key={f} value={f}>{f.charAt(0) + f.slice(1).toLowerCase()}</option>)}
              </select>
            </Field>
            <Field label="Kitchen layout">
              <select value={prefs.kitchenLayout} onChange={e => setPrefs({ ...prefs, kitchenLayout: e.target.value as KitchenLayout })} className="input">
                {['OPEN', 'CLOSED', 'ISLAND', 'PARALLEL', 'L_SHAPED'].map(k => <option key={k} value={k}>{k.replace('_', ' ').toLowerCase()}</option>)}
              </select>
            </Field>
            <Field label="Storage">
              <select value={prefs.storage} onChange={e => setPrefs({ ...prefs, storage: e.target.value as StoragePreference })} className="input">
                {['STANDARD', 'MAXIMUM', 'CONCEALED'].map(s => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
              </select>
            </Field>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-700 mb-1">Lighting (select all that apply)</div>
            <div className="flex flex-wrap gap-1.5">
              {(['AMBIENT', 'TASK', 'ACCENT', 'DECORATIVE'] as LightingPreference[]).map(l => {
                const on = prefs.lighting.includes(l);
                return (
                  <button
                    key={l}
                    onClick={() => setPrefs({ ...prefs, lighting: on ? prefs.lighting.filter(x => x !== l) : [...prefs.lighting, l] })}
                    className={`text-[11px] px-2 py-1 rounded border ${on ? 'bg-[#0F6CBD] text-white border-[#0F6CBD]' : 'bg-white text-slate-600 border-slate-300'}`}
                  >
                    {l.charAt(0) + l.slice(1).toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-700 mb-1">Special requirements</div>
            <div className="flex flex-wrap gap-1.5">
              {(['VASTU', 'ELDERLY_FRIENDLY', 'CHILDREN', 'PETS', 'ACCESSIBILITY'] as SpecialRequirement[]).map(s => {
                const on = prefs.specialRequirements.includes(s);
                return (
                  <button
                    key={s}
                    onClick={() =>
                      setPrefs({
                        ...prefs,
                        specialRequirements: on ? prefs.specialRequirements.filter(x => x !== s) : [...prefs.specialRequirements, s]
                      })
                    }
                    className={`text-[11px] px-2 py-1 rounded border ${on ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-300'}`}
                  >
                    {s.replace(/_/g, ' ').toLowerCase()}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-slate-700 mb-1">Room-specific instructions</div>
            <div className="space-y-1.5">
              {(model?.rooms || []).map(room => {
                const existing = prefs.roomInstructions.find(r => r.roomId === room.id);
                return (
                  <div key={room.id} className="grid grid-cols-1 sm:grid-cols-12 gap-1.5 items-center">
                    <span className="sm:col-span-4 text-[11px] text-slate-600 truncate">{room.name}</span>
                    <input
                      value={existing?.instruction || ''}
                      onChange={e => {
                        const others = prefs.roomInstructions.filter(r => r.roomId !== room.id);
                        const next: RoomInstruction[] = e.target.value
                          ? [...others, { roomId: room.id, roomName: room.name, instruction: e.target.value }]
                          : others;
                        setPrefs({ ...prefs, roomInstructions: next });
                      }}
                      placeholder="e.g. luxury modern, beige and walnut"
                      className="sm:col-span-8 border border-slate-300 rounded px-2 py-1 text-[11px]"
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <Field label="Anything else the design must respect">
            <textarea
              value={prefs.additionalNotes || ''}
              onChange={e => setPrefs({ ...prefs, additionalNotes: e.target.value })}
              rows={2}
              className="input"
              placeholder="Handover date, structural constraints, appliances already purchased..."
            />
          </Field>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
            <div className="flex items-center gap-2 text-[11px] text-slate-600">
              Concepts to generate:
              <select value={conceptCount} onChange={e => setConceptCount(Number(e.target.value))} className="border border-slate-300 rounded px-2 py-1 text-[11px]">
                {[3, 4, 5].map(n => <option key={n} value={n}>{n}</option>)}
              </select>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={savePreferences} disabled={busy === 'preferences'} className="border border-slate-300 rounded px-3 py-2 text-xs hover:bg-slate-50">
                {busy === 'preferences' ? 'Saving…' : 'Save preferences'}
              </button>
              <button
                onClick={generate}
                disabled={busy === 'generate'}
                className="inline-flex items-center gap-1.5 bg-[#0F6CBD] text-white text-xs font-semibold rounded px-3 py-2 disabled:opacity-50"
              >
                {busy === 'generate' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
                Generate {conceptCount} concepts
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- STEP 4 */}
      {step === 'concepts' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-[#0F6CBD]" /> {concepts.length} concepts from the same floor plan
            </h2>
            <button onClick={() => setStep('preferences')} className="text-[11px] text-[#0F6CBD] font-semibold">Change preferences</button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
            {concepts.map(c => (
              <div key={c.id} className="bg-white border border-slate-200 rounded overflow-hidden flex flex-col">
                <div className="relative">
                  <img src={c.roomSchemes[0]?.renderImageUrl || c.moodBoard[0]?.imageUrl} alt={c.name} className="w-full h-32 object-cover" />
                  <span className={`absolute top-2 left-2 text-[10px] px-1.5 py-0.5 rounded border bg-white/95 ${statusChip(c.status)}`}>
                    {c.status.replace('_', ' ')}
                  </span>
                  <span className="absolute top-2 right-2 text-[10px] px-1.5 py-0.5 rounded bg-slate-900/80 text-white">v{c.version}</span>
                </div>
                <div className="p-2.5 space-y-1.5 flex-1 flex flex-col">
                  <div>
                    <div className="text-[10px] font-mono text-slate-500">{c.code}</div>
                    <div className="text-sm font-bold text-slate-900">{c.name}</div>
                    <div className="text-[11px] text-slate-500">{c.tagline}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    {c.palette.slice(0, 4).map((hex, i) => (
                      <span key={i} className="w-3.5 h-3.5 rounded-full border border-white shadow" style={{ background: hex.split(' ')[0] }} title={hex} />
                    ))}
                  </div>
                  <div className="text-[11px] text-slate-700">
                    <b>{inr(c.estimatedCostMinINR)} – {inr(c.estimatedCostMaxINR)}</b>
                    <span className="text-slate-400"> · ₹{c.ratePerSqFt.toLocaleString('en-IN')}/sq.ft</span>
                  </div>
                  <div className="text-[10px] text-slate-500">{c.roomSchemes.length} rooms · {c.budgetBand.toLowerCase()} band</div>
                  <div className="mt-auto flex items-center gap-1 pt-1">
                    <button onClick={() => { setSelectedConceptId(c.id); setStep('review'); }} className="flex-1 text-[11px] border border-slate-300 rounded px-2 py-1 hover:bg-slate-50">
                      Compare
                    </button>
                    <button
                      onClick={() => { setRevisionTarget(c); setRevisionForm({ ...revisionForm, roomId: c.roomSchemes[0]?.roomId || '' }); }}
                      className="text-[11px] border border-slate-300 rounded px-2 py-1 hover:bg-slate-50 inline-flex items-center gap-1"
                    >
                      <MessageSquare className="w-3 h-3" /> Revise
                    </button>
                    <button
                      onClick={() => setAiConfirm(c)}
                      disabled={!aiStatus?.configured || c.status === 'APPROVED' || busy === 'ai-generate'}
                      title={c.status === 'APPROVED' ? 'Approved concepts are locked' : 'Generate renders and a narrative with Gemini'}
                      className="text-[11px] bg-[#0F6CBD] text-white rounded px-2 py-1 disabled:opacity-40 inline-flex items-center gap-1"
                    >
                      <Sparkles className="w-3 h-3" /> AI
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ------------------------------------------------------- STEP 5 */}
      {step === 'review' && (
        <div className="space-y-3">
          <div className="bg-white border border-slate-200 rounded overflow-hidden">
            <div className="p-3 border-b border-slate-200 flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <GitCompare className="w-4 h-4 text-[#0F6CBD]" /> Side-by-side comparison
              </h2>
              <p className="text-[11px] text-slate-500">Select one concept, then approve it to lock every room scheme.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-[11px]">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="text-left p-2">Criteria</th>
                    {concepts.map(c => (
                      <th key={c.id} className="text-left p-2 min-w-[190px]">
                        <div className="font-bold text-slate-800">{c.name}</div>
                        <div className="font-mono text-[10px] text-slate-500">{c.code} · v{c.version}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-t border-slate-100">
                    <td className="p-2 text-slate-500">Status</td>
                    {concepts.map(c => (
                      <td key={c.id} className="p-2">
                        <span className={`px-1.5 py-0.5 rounded border text-[10px] ${statusChip(c.status)}`}>{c.status.replace('_', ' ')}</span>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="p-2 text-slate-500">Estimate</td>
                    {concepts.map(c => (
                      <td key={c.id} className="p-2 font-semibold text-slate-800">{inr(c.estimatedCostMinINR)} – {inr(c.estimatedCostMaxINR)}</td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="p-2 text-slate-500">Palette</td>
                    {concepts.map(c => (
                      <td key={c.id} className="p-2">
                        <div className="flex gap-1">
                          {c.palette.map((hex, i) => (
                            <span key={i} className="w-3.5 h-3.5 rounded-full border border-slate-200" style={{ background: hex.split(' ')[0] }} title={hex} />
                          ))}
                        </div>
                      </td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="p-2 text-slate-500">Flooring / joinery</td>
                    {concepts.map(c => {
                      const floor = c.roomSchemes[0]?.materials.find(m => m.trade === 'FLOORING_TILING');
                      const joinery = c.roomSchemes[0]?.materials.find(m => m.trade === 'CARPENTRY_JOINERY' || m.trade === 'WARDROBES_STORAGE');
                      return (
                        <td key={c.id} className="p-2 text-slate-600">
                          {floor?.category || '—'}<br />
                          <span className="text-slate-400">{joinery?.category || 'no feature joinery in first room'}</span>
                        </td>
                      );
                    })}
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="p-2 text-slate-500">Revisions</td>
                    {concepts.map(c => (
                      <td key={c.id} className="p-2 text-slate-600">{c.revisions.length}</td>
                    ))}
                  </tr>
                  <tr className="border-t border-slate-100">
                    <td className="p-2 text-slate-500">Action</td>
                    {concepts.map(c => (
                      <td key={c.id} className="p-2">
                        <div className="flex flex-wrap gap-1">
                          <button onClick={() => selectConcept(c.id)} className="text-[10px] border border-slate-300 rounded px-1.5 py-1 hover:bg-slate-50">Select</button>
                          <button
                            onClick={() => { setRevisionTarget(c); setRevisionForm({ ...revisionForm, roomId: c.roomSchemes[0]?.roomId || '' }); }}
                            className="text-[10px] border border-slate-300 rounded px-1.5 py-1 hover:bg-slate-50"
                          >
                            Revise
                          </button>
                          <button
                            onClick={() => approveConcept(c.id)}
                            disabled={c.status === 'APPROVED' || busy === 'approve'}
                            className="text-[10px] bg-emerald-600 text-white rounded px-1.5 py-1 disabled:opacity-40"
                          >
                            {c.status === 'APPROVED' ? 'Approved' : 'Approve'}
                          </button>
                        </div>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {focusConcept && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
              <div className="lg:col-span-2 bg-white border border-slate-200 rounded p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-900">{focusConcept.name} · room-wise scheme</h3>
                  <span className="text-[11px] text-slate-500">{focusConcept.roomSchemes.filter(r => r.locked).length}/{focusConcept.roomSchemes.length} rooms locked</span>
                </div>
                <div className="mt-2 space-y-2 max-h-[420px] overflow-y-auto pr-1">
                  {focusConcept.roomSchemes.map(room => (
                    <div key={room.roomId} className="border border-slate-200 rounded p-2">
                      <div className="flex items-center justify-between">
                        <div className="text-[11px] font-semibold text-slate-800">{room.roomName}</div>
                        {room.locked && <span className="text-[10px] text-emerald-700 inline-flex items-center gap-0.5"><Lock className="w-3 h-3" /> locked</span>}
                      </div>
                      <div className="text-[10px] text-slate-500">{room.roomAreaSqFt} sq.ft · {room.roomPerimeterFt}' perimeter</div>
                      <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-1">
                        {room.materials.map((m, i) => (
                          <div key={i} className="text-[10px] text-slate-600">
                            <b>{m.category}:</b> {m.specification}
                            <span className="text-slate-400"> · ₹{m.indicativeRate}/{m.unit}</span>
                          </div>
                        ))}
                      </div>
                      {room.customerInstructionApplied && (
                        <div className="mt-1 text-[10px] text-[#0F6CBD]">Client brief: {room.customerInstructionApplied}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded p-3 space-y-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <button
                    onClick={() => setAiConfirm(focusConcept)}
                    disabled={!aiStatus?.configured || focusConcept.status === 'APPROVED' || busy === 'ai-generate'}
                    className="inline-flex items-center gap-1 text-[11px] bg-[#0F6CBD] text-white rounded px-2 py-1 disabled:opacity-40"
                  >
                    <Sparkles className="w-3 h-3" /> Renders + narrative
                  </button>
                  {focusConcept.aiGeneration && (
                    <span className="text-[10px] text-slate-500">
                      {focusConcept.aiGeneration.engine} · {focusConcept.aiGeneration.rendersSucceeded || 0} render(s)
                    </span>
                  )}
                </div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5"><Palette className="w-4 h-4 text-[#0F6CBD]" /> Why this concept</h3>
                <ul className="space-y-1">
                  {focusConcept.whyThisFits.map((w, i) => (
                    <li key={i} className="text-[11px] text-slate-600">• {w}</li>
                  ))}
                </ul>
                <h4 className="text-[11px] font-bold text-slate-800 pt-1">Constraints respected</h4>
                <ul className="space-y-1">
                  {focusConcept.constraintsRespected.map((w, i) => (
                    <li key={i} className="text-[11px] text-emerald-700">✓ {w}</li>
                  ))}
                </ul>
                {focusConcept.revisions.length > 0 && (
                  <>
                    <h4 className="text-[11px] font-bold text-slate-800 pt-1 flex items-center gap-1"><History className="w-3 h-3" /> Revision history</h4>
                    <ul className="space-y-1">
                      {focusConcept.revisions.map(r => (
                        <li key={r.id} className="text-[10px] text-slate-600">
                          <b>{r.changeType.replace(/_/g, ' ')}</b> · {r.requestedBy}
                          <div className="text-slate-500">{r.resultSummary}</div>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* ------------------------------------------------------- STEP 6 */}
      {step === 'boq' && (
        <div className="space-y-3">
          <div className="bg-white border border-slate-200 rounded p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <IndianRupee className="w-4 h-4 text-[#0F6CBD]" /> Detailed design → BOQ
              </h2>
              {approved ? (
                <span className="text-[11px] text-emerald-700 inline-flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Approved: {approved.name} v{approved.version}
                </span>
              ) : (
                <span className="text-[11px] text-amber-700 inline-flex items-center gap-1">
                  <AlertTriangle className="w-3.5 h-3.5" /> Approve a concept in step 5 first
                </span>
              )}
            </div>

            {session?.boqDraft ? (
              <>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                  {[
                    ['Lines', session.boqDraft.items.length],
                    ['Rooms', new Set(session.boqDraft.items.map(i => i.roomZone)).size],
                    ['Subtotal (ex-GST)', inr(session.boqDraft.subtotalSelling)],
                    ['With 18% GST', inr(session.boqDraft.subtotalSelling * 1.18)]
                  ].map(([label, value]) => (
                    <div key={String(label)} className="border border-slate-200 rounded p-2">
                      <div className="text-[10px] uppercase tracking-wide text-slate-500">{label}</div>
                      <div className="text-sm font-bold text-slate-900">{value}</div>
                    </div>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-2 mt-3">
                  <button onClick={generateBOQ} disabled={!approved || busy === 'boq'} className="inline-flex items-center gap-1.5 border border-slate-300 rounded px-3 py-2 text-xs hover:bg-slate-50 disabled:opacity-40">
                    {busy === 'boq' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />} Regenerate BOQ
                  </button>
                  <button onClick={() => onNavigateTab?.('boq')} className="inline-flex items-center gap-1.5 bg-[#0F6CBD] text-white text-xs font-semibold rounded px-3 py-2">
                    <FileText className="w-3.5 h-3.5" /> Open BOQ estimating engine
                  </button>
                  <button onClick={() => onNavigateTab?.('budget')} className="inline-flex items-center gap-1.5 border border-slate-300 rounded px-3 py-2 text-xs hover:bg-slate-50">
                    Budget &amp; margin
                  </button>
                  <button
                    onClick={handoffToTwin}
                    disabled={!approved || busy === 'handoff'}
                    title={approved ? 'Freeze the approved design and build the Project Design Digital Twin' : 'Approve a concept first'}
                    className="inline-flex items-center gap-1.5 border border-emerald-300 text-emerald-700 rounded px-3 py-2 text-xs hover:bg-emerald-50 disabled:opacity-40"
                  >
                    {busy === 'handoff' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                    Hand off to design twin
                  </button>
                  <button onClick={openPresentation} className="inline-flex items-center gap-1.5 border border-slate-300 rounded px-3 py-2 text-xs hover:bg-slate-50">
                    <Download className="w-3.5 h-3.5" /> Presentation pack
                  </button>
                </div>

                <div className="mt-3 overflow-x-auto border border-slate-200 rounded">
                  <table className="w-full text-[11px]">
                    <thead className="bg-slate-50 text-slate-600">
                      <tr>
                        <th className="text-left p-2">Room</th>
                        <th className="text-left p-2">Item</th>
                        <th className="text-right p-2">Qty</th>
                        <th className="text-left p-2">Unit</th>
                        <th className="text-right p-2">Rate</th>
                        <th className="text-right p-2">Amount</th>
                        <th className="text-left p-2">Rate source</th>
                      </tr>
                    </thead>
                    <tbody>
                      {session.boqDraft.items.map(item => (
                        <tr key={item.id} className="border-t border-slate-100">
                          <td className="p-2 text-slate-600">{item.roomZone}</td>
                          <td className="p-2">
                            <div className="font-medium text-slate-800">{item.itemCode} · {item.description.split(' as per')[0]}</div>
                            <div className="text-[10px] text-slate-500">{item.specification}</div>
                          </td>
                          <td className="p-2 text-right">{item.finalQuantity}</td>
                          <td className="p-2">{item.unit}</td>
                          <td className="p-2 text-right">₹{item.sellingRate.toLocaleString('en-IN')}</td>
                          <td className="p-2 text-right font-semibold">₹{item.sellingAmount.toLocaleString('en-IN')}</td>
                          <td className="p-2">
                            <span className={`px-1.5 py-0.5 rounded border text-[10px] ${item.rateStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-amber-50 text-amber-700 border-amber-200'}`}>
                              {item.rateStatus === 'APPROVED' ? 'Master rate' : 'Provisional'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="text-[10px] text-slate-500 mt-2">
                  Every line keeps its room reference and the concept version it came from. Provisional lines need a
                  vendor quote before the baseline is frozen by the estimator.
                </p>
              </>
            ) : (
              <div className="mt-3 border border-dashed border-slate-300 rounded p-6 text-center">
                <p className="text-xs text-slate-600">No BOQ generated yet for this design.</p>
                <button
                  onClick={generateBOQ}
                  disabled={!approved || busy === 'boq'}
                  className="mt-2 inline-flex items-center gap-1.5 bg-[#0F6CBD] text-white text-xs font-semibold rounded px-3 py-2 disabled:opacity-40"
                >
                  {busy === 'boq' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <IndianRupee className="w-3.5 h-3.5" />}
                  Generate room-wise BOQ from approved design
                </button>
              </div>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded p-3">
            <h3 className="text-xs font-bold text-slate-900 flex items-center gap-1.5 mb-1.5">
              <History className="w-3.5 h-3.5 text-[#0F6CBD]" /> Prompt &amp; approval history
            </h3>
            <div className="space-y-1 max-h-56 overflow-y-auto">
              {(session?.promptHistory || []).map(p => (
                <div key={p.id} className="text-[10px] text-slate-600 border-b border-slate-100 pb-1">
                  <span className="font-semibold text-slate-800">{p.action}</span> · {p.actor} ·{' '}
                  {new Date(p.timestamp).toLocaleString('en-IN')}
                  <div className="text-slate-500">{p.outputSummary}</div>
                </div>
              ))}
              {(session?.promptHistory || []).length === 0 && <p className="text-[11px] text-slate-500">No activity yet.</p>}
            </div>
          </div>
        </div>
      )}

      {/* Gemini AI consent + progress modal */}
      {aiConfirm && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 p-4 flex items-start sm:items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg p-4 w-full max-w-md space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#0F6CBD]" /> Gemini content for {aiConfirm.name}
              </h3>
              <button onClick={() => setAiConfirm(null)} aria-label="Close"><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <p className="text-[11px] text-slate-600">
              Gemini runs on the server with the project key — nothing is sent to a third-party browser SDK. This will:
            </p>
            <ul className="text-[11px] text-slate-600 space-y-1 ml-4 list-disc">
              <li>render up to 4 room images with {aiStatus?.imageModel || 'the image model'}</li>
              <li>rewrite the concept narrative with {aiStatus?.textModel || 'the text model'}</li>
              <li>store both against the concept with an audit entry</li>
            </ul>
            <p className="text-[11px] text-emerald-700">
              Quantities, rates, totals and the BOQ are not touched - AI only produces prose and images.
            </p>
            {aiProgress.total > 0 && (
              <p className="text-[11px] text-violet-700 inline-flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" /> {aiProgress.label} ({aiProgress.done}/{aiProgress.total})
              </p>
            )}
            <div className="flex flex-wrap justify-end gap-2">
              <button onClick={() => setAiConfirm(null)} className="border border-slate-300 rounded px-3 py-2 text-xs">Cancel</button>
              <button
                onClick={() => runAIGenerate(aiConfirm, { renders: true, narrative: false, maxRooms: 4 })}
                disabled={busy === 'ai-generate'}
                className="border border-blue-300 text-[#0F6CBD] rounded px-3 py-2 text-xs disabled:opacity-40"
              >
                Renders only
              </button>
              <button
                onClick={() => runAIGenerate(aiConfirm, { renders: false, narrative: true })}
                disabled={busy === 'ai-generate'}
                className="border border-blue-300 text-[#0F6CBD] rounded px-3 py-2 text-xs disabled:opacity-40"
              >
                Narrative only
              </button>
              <button
                onClick={() => runAIGenerate(aiConfirm, { renders: true, narrative: true, maxRooms: 4 })}
                disabled={busy === 'ai-generate'}
                className="bg-[#0F6CBD] text-white rounded px-3 py-2 text-xs font-semibold disabled:opacity-40"
              >
                {busy === 'ai-generate' ? 'Generating…' : 'Generate both'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* revision modal */}
      {revisionTarget && (
        <div className="fixed inset-0 z-[100] bg-slate-900/50 p-4 flex items-start sm:items-center justify-center overflow-y-auto">
          <div className="bg-white rounded-lg p-4 w-full max-w-xl space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900">Revise {revisionTarget.name} (v{revisionTarget.version})</h3>
              <button onClick={() => setRevisionTarget(null)} aria-label="Close"><X className="w-4 h-4 text-slate-500" /></button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              <label className="text-[11px] text-slate-600">
                Scope
                <select
                  value={revisionForm.scope}
                  onChange={e => setRevisionForm({ ...revisionForm, scope: e.target.value as 'WHOLE_CONCEPT' | 'ROOM' })}
                  className="input mt-1"
                >
                  <option value="WHOLE_CONCEPT">Whole concept</option>
                  <option value="ROOM">One room only</option>
                </select>
              </label>
              <label className="text-[11px] text-slate-600">
                Change type
                <select
                  value={revisionForm.changeType}
                  onChange={e => setRevisionForm({ ...revisionForm, changeType: e.target.value })}
                  className="input mt-1"
                >
                  {['COLOUR_ONLY', 'FLOORING_SWAP', 'SOFA_SWAP', 'MATERIAL_SWAP', 'LAYOUT_CHANGE', 'BUDGET_VARIANT', 'OTHER'].map(t => (
                    <option key={t} value={t}>{t.replace(/_/g, ' ').toLowerCase()}</option>
                  ))}
                </select>
              </label>
            </div>
            {revisionForm.scope === 'ROOM' && (
              <label className="block text-[11px] text-slate-600">
                Room
                <select value={revisionForm.roomId} onChange={e => setRevisionForm({ ...revisionForm, roomId: e.target.value })} className="input mt-1">
                  {revisionTarget.roomSchemes.map(r => (
                    <option key={r.roomId} value={r.roomId}>{r.roomName}</option>
                  ))}
                </select>
              </label>
            )}
            <label className="block text-[11px] text-slate-600">
              Instruction
              <textarea
                value={revisionForm.instruction}
                onChange={e => setRevisionForm({ ...revisionForm, instruction: e.target.value })}
                rows={3}
                className="input mt-1"
                placeholder="e.g. change only the great-room walls to a warmer beige; keep the walnut joinery"
              />
            </label>
            <p className="text-[10px] text-slate-500">
              Only the requested scope changes. Quantities, room geometry and every other room stay exactly as they are.
            </p>
            <div className="flex justify-end gap-2">
              <button onClick={() => setRevisionTarget(null)} className="border border-slate-300 rounded px-3 py-2 text-xs">Cancel</button>
              <button
                onClick={submitRevision}
                disabled={revisionForm.instruction.trim().length < 5 || busy === 'revision'}
                className="bg-[#0F6CBD] text-white rounded px-3 py-2 text-xs font-semibold disabled:opacity-40"
              >
                {busy === 'revision' ? 'Applying…' : 'Apply revision'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`.input{width:100%;border:1px solid #cbd5e1;border-radius:4px;padding:4px 6px;font-size:11px;background:#fff}`}</style>
    </div>
  );
};

function mimeTypeFor(fileName: string): string {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';
  if (ext === 'pdf') return 'application/pdf';
  if (ext === 'png') return 'image/png';
  if (ext === 'jpg' || ext === 'jpeg') return 'image/jpeg';
  if (ext === 'webp') return 'image/webp';
  return 'application/octet-stream';
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || '');
      resolve(result.includes(',') ? result.split(',')[1] : result);
    };
    reader.onerror = () => reject(new Error('Could not read the selected file.'));
    reader.readAsDataURL(file);
  });
}

const Field: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <label className="block text-[11px] text-slate-600">
    {label}
    <div className="mt-1">{children}</div>
  </label>
);

// ---------------------------------------------------------------------------
// Client presentation (printable, opens in a new tab)
// ---------------------------------------------------------------------------
function buildPresentationHtml(pack: any, project: ProjectRecord): string {
  const concept = pack.concept;
  const rooms = (concept?.roomSchemes || [])
    .map(
      (room: any) => `
      <div class="room">
        <div class="room-head">
          <h3>${room.roomName}</h3>
          <span>${room.roomAreaSqFt} sq.ft</span>
        </div>
        <img src="${room.renderImageUrl}" alt="${room.roomName}" />
        <div class="palette">${(room.palette || []).map((p: string) => `<span style="background:${p.split(' ')[0]}" title="${p}"></span>`).join('')}</div>
        <ul>${(room.materials || []).map((m: any) => `<li><b>${m.category}</b> - ${m.specification} <i>(${m.brandTier})</i></li>`).join('')}</ul>
        ${room.customerInstructionApplied ? `<p class="brief">Client brief: ${room.customerInstructionApplied}</p>` : ''}
      </div>`
    )
    .join('');

  const alternatives = (pack.alternatives || [])
    .map((a: any) => `<tr><td>${a.code}</td><td>${a.name}</td><td>${a.tagline}</td><td>₹${Math.round(a.estimateMin / 100000)}-${Math.round(a.estimateMax / 100000)} L</td><td>${a.status}</td></tr>`)
    .join('');

  return `<!doctype html><html><head><meta charset="utf-8"><title>${project.title} - AI Design Presentation</title>
  <style>
    body{font-family:Inter,Segoe UI,Arial,sans-serif;color:#1f2937;margin:0;padding:24px;background:#fff}
    h1{font-size:22px;margin:0 0 4px}h2{font-size:16px;margin:24px 0 8px;border-bottom:2px solid #0F6CBD;padding-bottom:4px}
    .meta{color:#6b7280;font-size:12px;margin-bottom:16px}
    .hero{display:flex;gap:16px;align-items:flex-start;margin-bottom:8px}
    .hero img{width:46%;border-radius:8px;object-fit:cover}
    .hero .txt{flex:1;font-size:12px;line-height:1.5}
    .rooms{display:grid;grid-template-columns:1fr 1fr;gap:14px}
    .room{border:1px solid #e5e7eb;border-radius:8px;padding:10px;page-break-inside:avoid}
    .room img{width:100%;height:150px;object-fit:cover;border-radius:6px}
    .room-head{display:flex;justify-content:space-between;align-items:baseline}
    .room-head h3{font-size:13px;margin:0 0 6px}.room-head span{font-size:11px;color:#6b7280}
    .palette{display:flex;gap:4px;margin:6px 0}
    .palette span{width:14px;height:14px;border-radius:50%;border:1px solid #e5e7eb;display:inline-block}
    ul{margin:4px 0 0 16px;padding:0;font-size:11px}li{margin-bottom:2px}
    .brief{font-size:11px;color:#0F6CBD;margin:6px 0 0}
    table{width:100%;border-collapse:collapse;font-size:11px}th,td{text-align:left;padding:6px;border-bottom:1px solid #e5e7eb}
    .foot{margin-top:24px;font-size:10px;color:#6b7280;border-top:1px solid #e5e7eb;padding-top:8px}
    @media print{body{padding:0}.room img{height:130px}}
  </style></head><body>
  <h1>${project.title}</h1>
  <div class="meta">${project.clientName} · ${project.siteAddress} · Prepared ${new Date().toLocaleDateString('en-IN')} · Concept ${concept?.code} v${concept?.version}</div>
  <div class="hero">
    <img src="${concept?.roomSchemes?.[0]?.renderImageUrl || ''}" alt="Hero" />
    <div class="txt">
      <h2 style="margin-top:0">${concept?.name} - ${concept?.tagline}</h2>
      <p>${concept?.narrative || ''}</p>
      <p><b>Indicative investment:</b> ₹${Math.round((concept?.estimatedCostMinINR || 0) / 100000)} L - ₹${Math.round((concept?.estimatedCostMaxINR || 0) / 100000)} L (ex-GST)</p>
      <p><b>Palette:</b> ${(concept?.palette || []).join(' · ')}</p>
    </div>
  </div>
  <h2>Room-wise design</h2>
  <div class="rooms">${rooms}</div>
  <h2>Alternatives presented</h2>
  <table><thead><tr><th>Code</th><th>Concept</th><th>Direction</th><th>Estimate</th><th>Status</th></tr></thead><tbody>${alternatives}</tbody></table>
  ${pack.boq ? `<h2>Preliminary BOQ</h2><p style="font-size:12px">${pack.boq.items} room-wise lines, subtotal ₹${Number(pack.boq.subtotalSelling).toLocaleString('en-IN')} before GST - subject to technical validation.</p>` : ''}
  <div class="foot">
    AI-generated visual concepts are for design direction only and are not execution drawings. Quantities and rates are
    subject to site measurement verification and vendor confirmation. Prepared by Build Storys Design Studio.
  </div>
  <script>window.onload=()=>{window.print()}</script>
  </body></html>`;
}

export default AIDesignStudioView;
