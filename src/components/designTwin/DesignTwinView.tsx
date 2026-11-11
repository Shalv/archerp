/**
 * Build Storys ERP - PROJECT DESIGN DIGITAL TWIN (M04-D)
 * ======================================================
 * Strict design-to-drawing traceability:
 *   floor -> room -> element (Wall A..D, ceiling, flooring, doors, electrical,
 *   lighting, furniture, plumbing) -> assets (elevation, render, mood board,
 *   material reference, construction detail, dimension sheet, spec, BOQ link)
 *
 * The package can only be released when all ten validation checks pass and the
 * package is approved. A change to one element regenerates only its own assets,
 * flags its dependents, prices the BOQ delta and re-opens approval.
 */

import React, { useEffect, useMemo, useState } from 'react';
import {
  AlertTriangle,
  BadgeCheck,
  Boxes,
  CheckCircle2,
  ChevronRight,
  FileWarning,
  GitBranch,
  Layers,
  Loader2,
  Lock,
  Package,
  RefreshCw,
  Ruler,
  ShieldCheck,
  Upload,
  X,
  History,
  ArrowRight
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../../types/erp';
import { apiJson, isApiUnavailable } from '../../utils/apiClient';
import {
  ASSET_TYPE_LABEL,
  AssetType,
  DesignAssetRecord,
  DesignElement,
  DesignTwin,
  MaterialSpecRecord,
  TwinRevision,
  TwinRoom,
  ValidationCheck
} from '../../types/designTwin';

interface Props {
  project: ProjectRecord;
  currentUser: UserSession;
  onNavigateTab?: (tab: string) => void;
}

const STATUS_STYLE: Record<string, string> = {
  APPROVED_FOR_EXECUTION: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  AWAITING_APPROVAL: 'bg-amber-50 text-amber-700 border-amber-200',
  VALIDATION_FAILED: 'bg-rose-50 text-rose-700 border-rose-200',
  DRAFT: 'bg-slate-50 text-slate-600 border-slate-200'
};

const ELEMENT_STATUS_DOT: Record<string, string> = {
  COMPLETE: 'bg-emerald-500',
  INCOMPLETE: 'bg-rose-500',
  NEEDS_REVIEW: 'bg-amber-500',
  NOT_APPLICABLE: 'bg-slate-300'
};

const inr = (n: number) => `₹${Math.round(n).toLocaleString('en-IN')}`;

export const DesignTwinView: React.FC<Props> = ({ project, currentUser }) => {
  const [twin, setTwin] = useState<DesignTwin | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [selectedElementId, setSelectedElementId] = useState('');
  const [assetDetail, setAssetDetail] = useState<DesignAssetRecord | null>(null);
  const [changeModal, setChangeModal] = useState<DesignElement | null>(null);
  const [publishReasons, setPublishReasons] = useState<string[]>([]);
  const [materials, setMaterials] = useState<{ project: MaterialSpecRecord[]; library: MaterialSpecRecord[] }>({
    project: [],
    library: []
  });
  const [changeForm, setChangeForm] = useState({
    field: 'MATERIAL' as 'MATERIAL' | 'COLOUR' | 'SPECIFICATION',
    toMaterialId: '',
    toText: '',
    toRate: '',
    reason: ''
  });
  const [lastRevision, setLastRevision] = useState<TwinRevision | null>(null);

  const api = async (path: string, method: string, body?: any) =>
    apiJson<any>(`/api/design-twin/${project.id}${path}`, {
      method,
      body: body ? JSON.stringify(body) : undefined
    });

  const load = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await apiJson<DesignTwin>(`/api/design-twin/${project.id}`).catch((err: any) => {
        if (err?.payload?.code === 'TWIN_NOT_BUILT') return null;
        throw err;
      });
      if (!data) {
        setTwin(null);
      } else {
        setTwin(data);
        if (!selectedElementId && data.rooms?.[0]?.elements?.[0]) {
          setSelectedElementId(data.rooms[0].elements[0].id);
        }
      }
      const mats = await apiJson<any>(`/api/design-twin/${project.id}/materials`).catch(() => null);
      if (mats) setMaterials(mats);
    } catch (e: any) {
      setTwin(null);
      setError(
        isApiUnavailable(e)
          ? e.message
          : e?.message || 'Could not load the design twin.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [project.id]);

  const run = async (label: string, fn: () => Promise<any>) => {
    setBusy(label);
    setError('');
    setNotice('');
    setPublishReasons([]);
    try {
      await fn();
    } catch (e: any) {
      setError(e.message || 'Something went wrong.');
      if (e.payload?.reasons) setPublishReasons(e.payload.reasons);
    } finally {
      setBusy('');
    }
  };

  const allElements = useMemo(
    () => (twin ? twin.rooms.flatMap(r => r.elements) : []),
    [twin]
  );
  const selected = allElements.find(el => el.id === selectedElementId);
  const selectedRoom = twin?.rooms.find(r => r.id === selected?.roomId);
  const selectedAssets = twin && selected
    ? twin.assets.filter(a => a.elementId === selected.id && a.status !== 'SUPERSEDED')
    : [];
  const elementMaterials = twin && selected
    ? twin.materials.filter(m => selected.spec.materialRefs.includes(m.id))
    : [];
  const pendingAssets = twin ? twin.assets.filter(a => a.status !== 'SUPERSEDED' && a.approvalStatus === 'PENDING') : [];
  const validation = twin?.validation;

  const build = () =>
    run('build', async () => {
      const built = await api('/build', 'POST', { force: Boolean(twin) });
      setTwin(built);
      setSelectedElementId(built.rooms?.[0]?.elements?.[0]?.id || '');
      setNotice(`Design twin built: ${built.rooms.length} rooms, ${built.assets.length} assets, ${built.validation?.passedCount}/${built.validation?.totalCount} checks passing.`);
    });

  const validate = () =>
    run('validate', async () => {
      const next = await api('/validate', 'POST');
      setTwin(next);
      setNotice(`Validation ${next.validation.passedCount}/${next.validation.totalCount} at ${next.validation.designVersion}.`);
    });

  const reissue = () =>
    run('reissue', async () => {
      const next = await api('/reissue', 'POST');
      setTwin(next);
      setNotice(`Package re-issued at ${next.designVersion}. Every active asset now carries one revision.`);
    });

  const approvePkg = () =>
    run('approve', async () => {
      const next = await api('/approve-package', 'POST');
      setTwin(next);
      setNotice(`Package approved for execution at ${next.designVersion}.`);
    });

  const publish = () =>
    run('publish', async () => {
      const result = await api('/publish', 'POST');
      if (result.ok) {
        setNotice(`Drawing package released at ${twin?.designVersion}.`);
      }
    });

  const approveElement = () =>
    run('approve-element', async () => {
      if (!selected) return;
      const next = await api(`/elements/${selected.id}/approve`, 'POST');
      setTwin(next);
      setNotice(`${selected.id} re-approved at ${next.designVersion}.`);
    });

  const applyChange = () =>
    run('change', async () => {
      if (!changeModal) return;
      const result = await api(`/elements/${changeModal.id}/change`, 'PUT', {
        field: changeForm.field,
        toMaterialId: changeForm.field === 'MATERIAL' ? changeForm.toMaterialId || undefined : undefined,
        toText: changeForm.toText || undefined,
        toRate: changeForm.toRate ? Number(changeForm.toRate) : undefined,
        reason: changeForm.reason
      });
      setTwin(result.twin);
      setLastRevision(result.revision);
      setChangeModal(null);
      setChangeForm({ field: 'MATERIAL', toMaterialId: '', toText: '', toRate: '', reason: '' });
      setNotice(
        `${result.revision.id} applied at ${result.revision.newVersion}: ${result.revision.affectedAssetIds.length} asset(s) regenerated, ${result.revision.dependentsFlagged.length} dependent element(s) flagged, BOQ delta ${inr(result.revision.boqImpact.delta)}.`
      );
    });

  const jumpTo = (check: ValidationCheck) => {
    if (check.elementIds.length) setSelectedElementId(check.elementIds[0]);
    else if (check.assetIds.length) {
      const asset = twin?.assets.find(a => a.id === check.assetIds[0]);
      if (asset) {
        setSelectedElementId(asset.elementId);
        setAssetDetail(asset);
      }
    }
  };

  // ------------------------------------------------------------------ empty state
  if (!loading && !twin) {
    return (
      <div className="space-y-4">
        <Header twin={null} project={project} busy={busy} onValidate={validate} onReissue={reissue} onApprovePkg={approvePkg} onPublish={publish} />
        {error && <Banner tone="error" text={error} />}
        <div className="bg-white border border-slate-200 rounded p-8 text-center space-y-3">
          <Boxes className="w-8 h-8 text-slate-300 mx-auto" />
          <h2 className="text-sm font-bold text-slate-900">No design twin for this project yet</h2>
          <p className="text-xs text-slate-500 max-w-xl mx-auto">
            The twin is built from an <b>approved design concept</b>, a <b>confirmed floor plan model</b> and the
            <b> room-wise BOQ</b>. It then owns every wall, ceiling, material, drawing and asset reference — nothing
            can be attached to the package without a room, an element and a material ID.
          </p>
          <button
            onClick={build}
            disabled={busy === 'build'}
            className="inline-flex items-center gap-1.5 bg-[#0F6CBD] text-white text-xs font-semibold rounded px-3 py-2 disabled:opacity-50"
          >
            {busy === 'build' ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Boxes className="w-3.5 h-3.5" />}
            Build from the approved concept
          </button>
        </div>
      </div>
    );
  }

  if (loading || !twin) {
    return (
      <div className="bg-white border border-slate-200 rounded p-10 text-center text-xs text-slate-500">
        <Loader2 className="w-4 h-4 animate-spin mx-auto mb-2" /> Loading the design twin…
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <Header
        twin={twin}
        project={project}
        busy={busy}
        onValidate={validate}
        onReissue={reissue}
        onApprovePkg={approvePkg}
        onPublish={publish}
      />

      {error && <Banner tone="error" text={error} />}
      {notice && <Banner tone="ok" text={notice} />}
      {publishReasons.length > 0 && (
        <div className="bg-rose-50 border border-rose-200 rounded p-3">
          <div className="text-xs font-bold text-rose-800 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" /> Release blocked
          </div>
          <ul className="mt-1 space-y-0.5">
            {publishReasons.map((r, i) => (
              <li key={i} className="text-[11px] text-rose-700">• {r}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-3">
        {/* ------------------------------------------------ tree */}
        <aside className="xl:col-span-3 bg-white border border-slate-200 rounded overflow-hidden">
          <div className="p-2.5 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-700 uppercase tracking-wide">Property tree</span>
            <span className="text-[10px] text-slate-500">{twin.rooms.length} rooms · {allElements.length} elements</span>
          </div>
          <div className="max-h-[70vh] overflow-y-auto p-2 space-y-2">
            {twin.floors.map(floor => (
              <div key={floor.id}>
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-700 px-1 py-0.5">
                  <Layers className="w-3 h-3 text-slate-400" /> {floor.name}
                </div>
                {floor.roomIds.map(roomId => {
                  const room = twin.rooms.find(r => r.id === roomId);
                  if (!room) return null;
                  return (
                    <div key={room.id} className="ml-2">
                      <div className="flex items-center gap-1.5 px-1 py-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${room.status === 'COMPLETE' ? 'bg-emerald-500' : room.status === 'NEEDS_REVIEW' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                        <span className="text-[11px] font-semibold text-slate-800 truncate">{room.name}</span>
                        <span className="text-[9px] text-slate-400 ml-auto">{room.id}</span>
                      </div>
                      <div className="ml-3 space-y-0.5">
                        {room.elements.map(el => (
                          <button
                            key={el.id}
                            onClick={() => setSelectedElementId(el.id)}
                            className={`w-full text-left flex items-center gap-1.5 px-1.5 py-0.5 rounded text-[10px] ${
                              selectedElementId === el.id ? 'bg-[#0F2A4A] text-white' : 'text-slate-600 hover:bg-slate-50'
                            }`}
                          >
                            <span className={`w-1 h-1 rounded-full ${ELEMENT_STATUS_DOT[el.status]}`} />
                            <span className="truncate">{el.label}</span>
                            {el.wallDirection && (
                              <span className={`ml-auto text-[8px] ${selectedElementId === el.id ? 'text-white/70' : 'text-slate-400'}`}>
                                {el.wallDirection.slice(0, 1)}
                              </span>
                            )}
                            {el.status === 'NEEDS_REVIEW' && <AlertTriangle className="w-2.5 h-2.5 text-amber-400 shrink-0" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </aside>

        {/* ------------------------------------------------ element package */}
        <section className="xl:col-span-6 space-y-3">
          <div className="bg-white border border-slate-200 rounded p-2.5">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-[#0F6CBD]" /> Project drawings &amp; images ({twin.projectDrawings?.length || 0})
              </h3>
              <span className="text-[10px] text-slate-500">
                Floor plans, CAD files and site media at {twin.designVersion}
              </span>
            </div>
            <div className="mt-1.5 flex gap-1.5 overflow-x-auto pb-1">
              {(twin.projectDrawings || []).map(drawing => (
                <a
                  key={drawing.id}
                  href={drawing.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 w-28 border border-slate-200 rounded overflow-hidden hover:border-[#0F6CBD]"
                  title={`${drawing.title} — ${drawing.notes || ''}`}
                >
                  <div className="h-14 bg-slate-50 flex items-center justify-center overflow-hidden">
                    {drawing.url.endsWith('.pdf') || drawing.url.endsWith('.dxf') ? (
                      <FileWarning className="w-4 h-4 text-slate-400" />
                    ) : (
                      <img src={drawing.url} alt={drawing.title} className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="p-1">
                    <div className="text-[8px] uppercase text-slate-400">{drawing.kind.replace('_', ' ')}</div>
                    <div className="text-[9px] text-slate-700 leading-tight line-clamp-2">{drawing.title}</div>
                  </div>
                </a>
              ))}
              {!twin.projectDrawings?.length && (
                <p className="text-[10px] text-slate-500 py-3">No project drawings registered.</p>
              )}
            </div>
          </div>

          {selected && selectedRoom ? (
            <>
              <div className="bg-white border border-slate-200 rounded p-3">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-[10px] bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded">{selected.id}</span>
                      <h2 className="text-sm font-bold text-slate-900">{selectedRoom.name} — {selected.label}</h2>
                      {selected.wallDirection && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded border border-slate-200 text-slate-600">{selected.wallDirection}</span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      {selectedRoom.id} · {selectedRoom.floorPlanRoomId} · {selectedRoom.conceptCode} v{selectedRoom.conceptVersion} ·{' '}
                      {selectedRoom.geometry.verified ? 'geometry verified' : 'GEOMETRY UNVERIFIED'}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className={`text-[10px] px-1.5 py-0.5 rounded border ${selected.status === 'COMPLETE' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : selected.status === 'NEEDS_REVIEW' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      {selected.status.replace(/_/g, ' ')}
                    </span>
                    <button
                      onClick={() => {
                        setChangeModal(selected);
                        setChangeForm({ field: 'MATERIAL', toMaterialId: '', toText: '', toRate: '', reason: '' });
                      }}
                      className="text-[11px] border border-slate-300 rounded px-2 py-1 hover:bg-slate-50 inline-flex items-center gap-1"
                    >
                      <GitBranch className="w-3 h-3" /> Change
                    </button>
                    {selectedAssets.some(a => a.approvalStatus === 'PENDING') && (
                      <button
                        onClick={approveElement}
                        disabled={busy === 'approve-element'}
                        className="text-[11px] bg-emerald-600 text-white rounded px-2 py-1 disabled:opacity-50 inline-flex items-center gap-1"
                      >
                        <BadgeCheck className="w-3 h-3" /> Approve revision
                      </button>
                    )}
                  </div>
                </div>

                {selected.reviewFlags.length > 0 && (
                  <div className="mt-2 bg-amber-50 border border-amber-200 rounded p-2">
                    {selected.reviewFlags.map((flag, i) => (
                      <div key={i} className="text-[10px] text-amber-800">⚠ {flag}</div>
                    ))}
                  </div>
                )}

                <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                  <div className="border border-slate-200 rounded p-2">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold flex items-center gap-1">
                      <Ruler className="w-3 h-3" /> Dimensions (verified basis)
                    </div>
                    <div className="text-[11px] text-slate-700 mt-1">
                      {selected.spec.dimensions.lengthFt}' × {selected.spec.dimensions.widthFt}' × {selected.spec.dimensions.heightFt}'
                    </div>
                    <div className="text-[10px] text-slate-500">
                      {selected.spec.dimensions.verified ? 'Verified' : 'UNVERIFIED — drawings blocked'} · {selectedRoom.geometry.areaSqFt} sq.ft
                    </div>
                  </div>
                  <div className="border border-slate-200 rounded p-2">
                    <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Colour palette (approved)</div>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {selected.spec.colourRefs.length ? (
                        selected.spec.colourRefs.map((c, i) => (
                          <span key={i} className="inline-flex items-center gap-1 text-[9px] text-slate-600 border border-slate-200 rounded px-1 py-0.5">
                            <span className="w-2.5 h-2.5 rounded-full border border-slate-200" style={{ background: c.split(' ')[0] }} />
                            {(c.split(' ')[1] || c).slice(0, 12)}
                          </span>
                        ))
                      ) : (
                        <span className="text-[10px] text-slate-400">none</span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-2 border border-slate-200 rounded p-2">
                  <div className="text-[10px] uppercase tracking-wide text-slate-500 font-semibold">Material specification (by ID)</div>
                  {elementMaterials.length ? (
                    <ul className="mt-1 space-y-1">
                      {elementMaterials.map(m => (
                        <li key={m.id} className="text-[11px] text-slate-700 flex flex-wrap items-baseline gap-1.5">
                          <span className="font-mono text-[9px] bg-slate-100 px-1 rounded">{m.id}</span>
                          <b>{m.name}</b>
                          <span className="text-slate-500">{m.specification}</span>
                          <span className="text-slate-400">· {m.brand} · {m.finish} · {inr(m.rate)}/{m.unit} · qty {m.boqQuantity}</span>
                          <span className={`text-[9px] px-1 rounded border ${m.approved ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                            {m.approved ? 'approved' : 'not approved'}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[11px] text-slate-500 mt-1">
                      {selected.status === 'NOT_APPLICABLE' ? 'Not applicable in this room.' : 'No approved material — this element cannot be drawn or priced.'}
                    </p>
                  )}
                  {selected.spec.constructionNotes.length > 0 && (
                    <ul className="mt-1.5 space-y-0.5">
                      {selected.spec.constructionNotes.map((n, i) => (
                        <li key={i} className="text-[10px] text-slate-500">• {n}</li>
                      ))}
                    </ul>
                  )}
                  {(selected.spec.furnitureRefs.length > 0 || selected.spec.lightingRefs.length > 0 || selected.spec.plumbingRefs.length > 0) && (
                    <div className="mt-1.5 text-[10px] text-slate-600 space-y-0.5">
                      {selected.spec.furnitureRefs.length > 0 && <div><b>Furniture:</b> {selected.spec.furnitureRefs.join('; ')}</div>}
                      {selected.spec.lightingRefs.length > 0 && <div><b>Lighting:</b> {selected.spec.lightingRefs.join('; ')}</div>}
                      {selected.spec.plumbingRefs.length > 0 && <div><b>Services:</b> {selected.spec.plumbingRefs.join(', ')}</div>}
                    </div>
                  )}
                  <div className="mt-1.5 text-[10px] text-slate-500">
                    <b>BOQ:</b> {selected.boqItemCodes.length ? selected.boqItemCodes.join(', ') : 'no BOQ line'}
                  </div>
                </div>
              </div>

              {/* assets */}
              <div className="bg-white border border-slate-200 rounded p-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-bold text-slate-800">Linked deliverables ({selectedAssets.length})</h3>
                  <span className="text-[10px] text-slate-500">
                    Every asset carries room, element, design version, revision and material IDs
                  </span>
                </div>
                <div className="mt-2 grid grid-cols-2 md:grid-cols-3 gap-2">
                  {selectedAssets.map(asset => (
                    <button
                      key={asset.id}
                      onClick={() => setAssetDetail(asset)}
                      className="text-left border border-slate-200 rounded overflow-hidden hover:border-[#0F6CBD] transition"
                    >
                      {asset.url ? (
                        <img src={asset.url} alt={asset.id} className="w-full h-24 object-cover bg-slate-50" />
                      ) : (
                        <div className="w-full h-24 bg-slate-50 flex items-center justify-center">
                          <FileWarning className="w-5 h-5 text-slate-300" />
                        </div>
                      )}
                      <div className="p-1.5">
                        <div className="text-[10px] font-semibold text-slate-700 truncate">{ASSET_TYPE_LABEL[asset.assetType]}</div>
                        <div className="text-[9px] font-mono text-slate-400 truncate">{asset.id}</div>
                        <div className="flex items-center gap-1 mt-0.5">
                          <span className={`text-[8px] px-1 rounded border ${asset.approvalStatus === 'APPROVED' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : asset.approvalStatus === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                            {asset.approvalStatus.toLowerCase()}
                          </span>
                          <span className="text-[8px] text-slate-400">{asset.revision}</span>
                          {asset.status !== 'READY' && <span className="text-[8px] text-rose-600">{asset.status.replace(/_/g, ' ').toLowerCase()}</span>}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-white border border-slate-200 rounded p-8 text-center text-xs text-slate-500">
              Select an element in the property tree.
            </div>
          )}

          {lastRevision && (
            <div className="bg-white border border-violet-200 rounded p-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold text-violet-800 flex items-center gap-1.5">
                  <History className="w-3.5 h-3.5" /> Last revision {lastRevision.id}
                </h3>
                <button onClick={() => setLastRevision(null)} aria-label="Dismiss"><X className="w-3.5 h-3.5 text-slate-400" /></button>
              </div>
              <div className="text-[11px] text-slate-600 mt-1">
                {lastRevision.previousVersion} → {lastRevision.newVersion} · {lastRevision.change.field.toLowerCase()}:
                <b> {lastRevision.change.from}</b> → <b>{lastRevision.change.to}</b>
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">Reason: {lastRevision.change.reason}</div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 mt-2">
                {[
                  ['Assets regenerated', lastRevision.affectedAssetIds.length],
                  ['Assets superseded', lastRevision.supersededAssetIds.length],
                  ['Dependents flagged', lastRevision.dependentsFlagged.length],
                  ['BOQ delta', inr(lastRevision.boqImpact.delta)]
                ].map(([label, value]) => (
                  <div key={String(label)} className="border border-slate-200 rounded p-1.5">
                    <div className="text-[9px] uppercase text-slate-500">{label}</div>
                    <div className="text-[11px] font-bold text-slate-800">{value}</div>
                  </div>
                ))}
              </div>
              {lastRevision.boqImpact.itemCodes.length > 0 && (
                <div className="text-[10px] text-slate-500 mt-1">
                  BOQ lines affected: {lastRevision.boqImpact.itemCodes.join(', ')} · {inr(lastRevision.boqImpact.previousAmount)} → {inr(lastRevision.boqImpact.newAmount)}
                </div>
              )}
            </div>
          )}
        </section>

        {/* ------------------------------------------------ validation + history */}
        <aside className="xl:col-span-3 space-y-3">
          <div className="bg-white border border-slate-200 rounded p-3">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#0F6CBD]" /> Package validation
              </h3>
              <span className={`text-[10px] px-1.5 py-0.5 rounded border ${validation?.passed ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                {validation ? `${validation.passedCount}/${validation.totalCount}` : 'not run'}
              </span>
            </div>
            {validation ? (
              <>
                <div className="mt-2 h-1.5 rounded bg-slate-100 overflow-hidden">
                  <div
                    className={`h-full ${validation.passed ? 'bg-emerald-500' : 'bg-rose-500'}`}
                    style={{ width: `${(validation.passedCount / validation.totalCount) * 100}%` }}
                  />
                </div>
                <div className="mt-1 text-[10px] text-slate-500">
                  {validation.designVersion} · {new Date(validation.validatedAt).toLocaleString('en-IN')} · {validation.validatedBy}
                </div>
                <ul className="mt-2 space-y-1">
                  {validation.checks.map(check => (
                    <li key={check.id}>
                      <button onClick={() => jumpTo(check)} className="w-full text-left flex items-start gap-1.5 group">
                        {check.passed ? (
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" />
                        ) : (
                          <AlertTriangle className="w-3 h-3 text-rose-500 mt-0.5 shrink-0" />
                        )}
                        <span>
                          <span className={`text-[10px] font-medium ${check.passed ? 'text-slate-700' : 'text-rose-700'} group-hover:underline`}>
                            {check.label}
                          </span>
                          {!check.passed && <span className="block text-[9px] text-rose-600">{check.detail}</span>}
                        </span>
                      </button>
                    </li>
                  ))}
                </ul>
              </>
            ) : (
              <p className="text-[11px] text-slate-500 mt-2">Run validation to test the ten mandatory relationships.</p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded p-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
              <Package className="w-3.5 h-3.5 text-[#0F6CBD]" /> Release gate
            </h3>
            <div className="space-y-1 text-[10px]">
              <GateRow ok={Boolean(validation?.passed)} label="Validation passed" />
              <GateRow ok={twin.packageStatus === 'APPROVED_FOR_EXECUTION'} label="Package approved" />
              <GateRow ok={pendingAssets.length === 0} label={`No pending assets (${pendingAssets.length})`} />
            </div>
            <button
              onClick={publish}
              disabled={busy === 'publish'}
              className="mt-2 w-full inline-flex items-center justify-center gap-1.5 bg-[#0F6CBD] text-white text-[11px] font-semibold rounded px-2 py-1.5 disabled:opacity-50"
            >
              {busy === 'publish' ? <Loader2 className="w-3 h-3 animate-spin" /> : <ArrowRight className="w-3 h-3" />}
              Release drawing package
            </button>
            {pendingAssets.length > 0 && (
              <p className="text-[9px] text-amber-700 mt-1">
                {pendingAssets.length} asset(s) awaiting approval — approve the element revision first.
              </p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded p-3">
            <h3 className="text-xs font-bold text-slate-800 flex items-center gap-1.5 mb-1.5">
              <History className="w-3.5 h-3.5 text-[#0F6CBD]" /> Revision history ({twin.revisions.length})
            </h3>
            <div className="max-h-64 overflow-y-auto space-y-1.5">
              {[...twin.revisions].reverse().map(rev => (
                <div key={rev.id} className="border-l-2 border-slate-200 pl-2">
                  <div className="text-[10px] font-semibold text-slate-700">{rev.id}</div>
                  <div className="text-[9px] text-slate-500">
                    {rev.previousVersion} → {rev.newVersion} · {rev.scope.toLowerCase()} · {rev.status.replace(/_/g, ' ').toLowerCase()}
                  </div>
                  <div className="text-[9px] text-slate-600">{rev.change.from} → {rev.change.to}</div>
                  {rev.boqImpact.delta !== 0 && (
                    <div className={`text-[9px] ${rev.boqImpact.delta > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
                      BOQ {rev.boqImpact.delta > 0 ? '+' : ''}{inr(rev.boqImpact.delta)}
                    </div>
                  )}
                </div>
              ))}
              {twin.revisions.length === 0 && <p className="text-[10px] text-slate-500">No revisions yet.</p>}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded p-3">
            <h3 className="text-xs font-bold text-slate-800 mb-1.5">Approvals ({twin.approvals.length})</h3>
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {twin.approvals.slice(-6).reverse().map(a => (
                <div key={a.id} className="text-[9px] text-slate-600">
                  <b>{a.level}</b> · {a.scopeId} · {a.by} · {a.designVersion}
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>

      {/* ------------------------------------------------ asset metadata drawer */}
      {assetDetail && (
        <Modal title={`Asset ${assetDetail.id}`} onClose={() => setAssetDetail(null)}>
          {assetDetail.url && (
            <img src={assetDetail.url} alt={assetDetail.id} className="w-full max-h-64 object-contain bg-slate-50 border border-slate-200 rounded" />
          )}
          <div className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 text-[11px]">
            {[
              ['Asset ID', assetDetail.id],
              ['Project ID', assetDetail.projectId],
              ['Room ID', assetDetail.roomId],
              ['Element ID', assetDetail.elementId],
              ['Asset type', ASSET_TYPE_LABEL[assetDetail.assetType]],
              ['Design version', assetDetail.designVersion],
              ['Drawing reference', assetDetail.drawingRef || '—'],
              ['Material references', assetDetail.materialRefs.join(', ') || '—'],
              ['Source', assetDetail.source.replace(/_/g, ' ').toLowerCase()],
              ['Prompt reference', assetDetail.promptRef || '—'],
              ['Approval status', assetDetail.approvalStatus.toLowerCase()],
              ['Parent asset', assetDetail.parentAssetId || '—'],
              ['Revision', assetDetail.revision],
              ['Supersedes', assetDetail.supersedes || '—'],
              ['Status', assetDetail.status.replace(/_/g, ' ').toLowerCase()],
              ['Approved by', assetDetail.approvedBy || '—']
            ].map(([label, value]) => (
              <div key={String(label)} className="flex justify-between gap-2 border-b border-slate-100 py-0.5">
                <span className="text-slate-500">{label}</span>
                <span className="text-slate-800 font-medium text-right break-words">{value}</span>
              </div>
            ))}
          </div>
          <div className="mt-2 border border-slate-200 rounded p-2 bg-slate-50">
            <div className="text-[10px] font-bold text-slate-700">Provenance</div>
            <div className="text-[10px] text-slate-600">{assetDetail.provenance.method}</div>
            <div className="text-[10px] text-slate-500 mt-1">
              Origin: {assetDetail.provenance.origin}
              {assetDetail.provenance.model ? ` · model ${assetDetail.provenance.model}` : ''}
              {assetDetail.provenance.generatedAt ? ` · ${new Date(assetDetail.provenance.generatedAt).toLocaleString('en-IN')}` : ''}
            </div>
            {assetDetail.provenance.sourceUrl && (
              <div className="text-[10px] text-slate-500 break-all">Source: {assetDetail.provenance.sourceUrl}</div>
            )}
            <div className="text-[10px] text-slate-500">Licence: {assetDetail.provenance.licence || 'internal project asset'}</div>
          </div>
          {assetDetail.geometryBasis && (
            <div className="mt-2 text-[10px] text-slate-600">
              <b>Geometry basis:</b> {assetDetail.geometryBasis.lengthFt}' × {assetDetail.geometryBasis.widthFt}' ×{' '}
              {assetDetail.geometryBasis.ceilingHeightFt}' · {assetDetail.geometryBasis.verified ? 'verified' : 'UNVERIFIED'} ·{' '}
              {assetDetail.geometryBasis.sourceRef}
            </div>
          )}
          {assetDetail.notes && <div className="mt-2 text-[10px] text-slate-600 whitespace-pre-wrap">{assetDetail.notes}</div>}
        </Modal>
      )}

      {/* ------------------------------------------------ change modal */}
      {changeModal && twin && (
        <Modal title={`Change ${changeModal.id} — ${changeModal.label}`} onClose={() => setChangeModal(null)}>
          <div className="space-y-2">
            <label className="block text-[11px] text-slate-600">
              What changes
              <select
                value={changeForm.field}
                onChange={e => setChangeForm({ ...changeForm, field: e.target.value as any })}
                className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-[11px]"
              >
                <option value="MATERIAL">Material / finish</option>
                <option value="COLOUR">Colour palette</option>
                <option value="SPECIFICATION">Specification text</option>
              </select>
            </label>

            {changeForm.field === 'MATERIAL' && (
              <>
                <label className="block text-[11px] text-slate-600">
                  Switch to an approved material
                  <select
                    value={changeForm.toMaterialId}
                    onChange={e => setChangeForm({ ...changeForm, toMaterialId: e.target.value })}
                    className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-[11px]"
                  >
                    <option value="">— choose from the finish library —</option>
                    {[...materials.library, ...materials.project.filter(m => m.approved)].map(m => (
                      <option key={m.id} value={m.id}>
                        {m.name} · {m.brand} · ₹{m.rate}/{m.unit} ({m.id})
                      </option>
                    ))}
                  </select>
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <label className="block text-[11px] text-slate-600">
                    …or a new specification
                    <input
                      value={changeForm.toText}
                      onChange={e => setChangeForm({ ...changeForm, toText: e.target.value })}
                      placeholder="e.g. Natural oak veneer, PU matt"
                      className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-[11px]"
                    />
                  </label>
                  <label className="block text-[11px] text-slate-600">
                    Rate per unit (₹)
                    <input
                      value={changeForm.toRate}
                      onChange={e => setChangeForm({ ...changeForm, toRate: e.target.value })}
                      type="number"
                      placeholder="845"
                      className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-[11px]"
                    />
                  </label>
                </div>
              </>
            )}

            {changeForm.field === 'COLOUR' && (
              <label className="block text-[11px] text-slate-600">
                New palette (hex + name, separated by /)
                <input
                  value={changeForm.toText}
                  onChange={e => setChangeForm({ ...changeForm, toText: e.target.value })}
                  placeholder="#F5F1E8 Ivory / #C9A87C Oak / #3E3A35 Walnut"
                  className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-[11px]"
                />
              </label>
            )}

            {changeForm.field === 'SPECIFICATION' && (
              <label className="block text-[11px] text-slate-600">
                New specification
                <textarea
                  value={changeForm.toText}
                  onChange={e => setChangeForm({ ...changeForm, toText: e.target.value })}
                  rows={3}
                  className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-[11px]"
                />
              </label>
            )}

            <label className="block text-[11px] text-slate-600">
              Reason (recorded in the revision history) *
              <input
                value={changeForm.reason}
                onChange={e => setChangeForm({ ...changeForm, reason: e.target.value })}
                placeholder="Client requested a lighter veneer after sample review"
                className="mt-1 w-full border border-slate-300 rounded px-2 py-1 text-[11px]"
              />
            </label>

            <div className="border border-slate-200 rounded p-2 bg-slate-50">
              <div className="text-[10px] font-bold text-slate-700">What this will do</div>
              <ul className="mt-1 space-y-0.5 text-[10px] text-slate-600">
                <li>• regenerate only this element's assets at the next revision, keeping the previous approved version</li>
                <li>• flag {changeModal.dependents.length} dependent element(s): {changeModal.dependents.join(', ') || 'none'}</li>
                <li>• re-price the linked BOQ line(s) {changeModal.boqItemCodes.join(', ') || '(none)'}</li>
                <li>• set the package back to awaiting approval — release is blocked until re-validated and approved</li>
              </ul>
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button onClick={() => setChangeModal(null)} className="border border-slate-300 rounded px-3 py-2 text-xs">Cancel</button>
              <button
                onClick={applyChange}
                disabled={busy === 'change' || changeForm.reason.trim().length < 8 || (changeForm.field === 'MATERIAL' && !changeForm.toMaterialId && !changeForm.toText)}
                className="bg-[#0F6CBD] text-white rounded px-3 py-2 text-xs font-semibold disabled:opacity-40"
              >
                {busy === 'change' ? 'Applying…' : 'Apply change'}
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// small components
// ---------------------------------------------------------------------------
const Header: React.FC<{
  twin: DesignTwin | null;
  project: ProjectRecord;
  busy: string;
  onValidate: () => void;
  onReissue: () => void;
  onApprovePkg: () => void;
  onPublish: () => void;
}> = ({ twin, project, busy, onValidate, onReissue, onApprovePkg, onPublish }) => (
  <div className="bg-white border border-[#d2d0ce] rounded shadow-xs p-3">
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-2">
      <div>
        <div className="flex items-center gap-2">
          <span className="bg-[#0F2A4A] text-white text-[10px] font-bold px-2 py-0.5 rounded">M04-D</span>
          <h1 className="text-base font-bold text-slate-900">Project Design Digital Twin</h1>
          {twin && (
            <span className={`text-[10px] px-1.5 py-0.5 rounded border ${STATUS_STYLE[twin.packageStatus]}`}>
              {twin.packageStatus.replace(/_/g, ' ').toLowerCase()} · {twin.designVersion}
            </span>
          )}
        </div>
        <p className="text-[11px] text-slate-500 mt-0.5">
          {project.projectCode} · one registry for rooms, walls, materials, drawings and BOQ — every asset linked to its
          element and design revision. Nothing enters the package without a material ID.
        </p>
      </div>
      {twin && (
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <button onClick={onValidate} disabled={busy === 'validate'} className="inline-flex items-center gap-1 border border-slate-300 rounded px-2 py-1.5 hover:bg-slate-50 disabled:opacity-50">
            {busy === 'validate' ? <Loader2 className="w-3 h-3 animate-spin" /> : <ShieldCheck className="w-3 h-3" />} Validate
          </button>
          <button onClick={onReissue} disabled={busy === 'reissue'} className="inline-flex items-center gap-1 border border-slate-300 rounded px-2 py-1.5 hover:bg-slate-50 disabled:opacity-50">
            {busy === 'reissue' ? <Loader2 className="w-3 h-3 animate-spin" /> : <RefreshCw className="w-3 h-3" />} Re-issue
          </button>
          <button onClick={onApprovePkg} disabled={busy === 'approve'} className="inline-flex items-center gap-1 border border-emerald-300 text-emerald-700 rounded px-2 py-1.5 hover:bg-emerald-50 disabled:opacity-50">
            {busy === 'approve' ? <Loader2 className="w-3 h-3 animate-spin" /> : <BadgeCheck className="w-3 h-3" />} Approve package
          </button>
          <button onClick={onPublish} disabled={busy === 'publish'} className="inline-flex items-center gap-1 bg-[#0F6CBD] text-white rounded px-2 py-1.5 disabled:opacity-50">
            {busy === 'publish' ? <Loader2 className="w-3 h-3 animate-spin" /> : <Package className="w-3 h-3" />} Release
          </button>
        </div>
      )}
    </div>
  </div>
);

const Banner: React.FC<{ tone: 'ok' | 'error'; text: string }> = ({ tone, text }) => (
  <div className={`text-[11px] rounded p-2.5 border flex items-start gap-2 ${tone === 'ok' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}>
    {tone === 'ok' ? <CheckCircle2 className="w-3.5 h-3.5 mt-0.5 shrink-0" /> : <AlertTriangle className="w-3.5 h-3.5 mt-0.5 shrink-0" />}
    <span>{text}</span>
  </div>
);

const GateRow: React.FC<{ ok: boolean; label: string }> = ({ ok, label }) => (
  <div className="flex items-center gap-1.5">
    {ok ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <AlertTriangle className="w-3 h-3 text-rose-500" />}
    <span className={ok ? 'text-slate-600' : 'text-rose-700'}>{label}</span>
  </div>
);

const Modal: React.FC<{ title: string; onClose: () => void; children: React.ReactNode }> = ({ title, onClose, children }) => (
  <div className="fixed inset-0 z-[100] bg-slate-900/50 p-4 flex items-start sm:items-center justify-center overflow-y-auto">
    <div className="bg-white rounded-lg p-4 w-full max-w-2xl max-h-[90dvh] overflow-y-auto">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-slate-900">{title}</h3>
        <button onClick={onClose} aria-label="Close"><X className="w-4 h-4 text-slate-500" /></button>
      </div>
      {children}
    </div>
  </div>
);

export default DesignTwinView;
