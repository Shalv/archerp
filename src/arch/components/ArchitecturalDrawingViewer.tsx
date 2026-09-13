import React, { useState } from 'react';
import {
  Maximize2,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Tag,
  Layers,
  Camera,
  Palette,
  Paperclip,
  Compass,
  Ruler,
  X,
  Plus,
  Sparkles,
  Upload,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
} from 'lucide-react';
import {
  ArchitecturalVisualAsset,
  ConceptOption,
  ProjectCustomer,
  MaterialSpec,
  SampleInspirationData,
} from '../types';
import { Perspective3DSheet } from './drawing-sheets/Perspective3DSheet';
import { CADFloorPlanSheet } from './drawing-sheets/CADFloorPlanSheet';
import { SectionElevationSheet } from './drawing-sheets/SectionElevationSheet';
import { MaterialSwatchesSheet } from './drawing-sheets/MaterialSwatchesSheet';
import { ClientReferenceSheet } from './drawing-sheets/ClientReferenceSheet';
import { MassingSchematicSheet } from './drawing-sheets/MassingSchematicSheet';
import { AddSampleDataModal } from './AddSampleDataModal';
import { GeminiAssetGeneratorModal } from './GeminiAssetGeneratorModal';
import { UploadProcessImageModal } from './UploadProcessImageModal';
import { ApproveDrawingSheetsModal } from './ApproveDrawingSheetsModal';

interface ArchitecturalDrawingViewerProps {
  concept: ConceptOption;
  clientName: string;
  builtUpAreaSqFt: number;
  project?: ProjectCustomer;
  onAttachSampleData?: (sample: {
    title: string;
    description: string;
    imageUrl: string;
    sourceType: 'client_upload' | 'sample_data' | 'site_survey';
    tags: string[];
  }) => void;
  renderSchematicSvg?: (type: string, theme: string) => React.ReactNode;
  isPresentationMode?: boolean;
  onUpdateVisualAsset?: (typeOrId: string, updates: Partial<ArchitecturalVisualAsset>) => void;
  onApproveDrawingSheets?: (approverName: string, approverRole: string, notes?: string) => void;
  onDiscardDraftSheets?: () => void;
  onStageCustomUpload?: (
    sheetType: ArchitecturalVisualAsset['type'],
    fileDataUrl: string,
    metadata: {
      title?: string;
      drawingNumber?: string;
      subtitle?: string;
      caption?: string;
      tags?: string[];
      scale?: string;
      revision?: string;
    }
  ) => void;
  onAddMaterial?: (material: MaterialSpec) => void;
  onAddReference?: (ref: Omit<SampleInspirationData, 'id'>) => void;
  onDeleteReference?: (id: string) => void;
}

export const ArchitecturalDrawingViewer: React.FC<ArchitecturalDrawingViewerProps> = ({
  concept,
  clientName,
  builtUpAreaSqFt,
  project,
  onAttachSampleData,
  renderSchematicSvg,
  isPresentationMode = false,
  onUpdateVisualAsset,
  onApproveDrawingSheets,
  onDiscardDraftSheets,
  onStageCustomUpload,
  onAddMaterial,
  onAddReference,
  onDeleteReference,
}) => {
  const visualAssets = concept.visualAssets || [];

  const [activeViewType, setActiveViewType] = useState<
    'render_3d' | 'cad_floor_plan' | 'elevation_section' | 'material_moodboard' | 'client_reference' | 'schematic'
  >('render_3d');

  // Lightbox modal state
  const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);
  const [lightboxZoom, setLightboxZoom] = useState<number>(1);
  const [lightboxCustomImage, setLightboxCustomImage] = useState<{ url: string; title: string } | null>(null);
  const [isAddSampleModalOpen, setIsAddSampleModalOpen] = useState<boolean>(false);
  const [isGeminiGeneratorOpen, setIsGeminiGeneratorOpen] = useState<boolean>(false);

  // Upload own image and Approval modals
  const [isUploadProcessModalOpen, setIsUploadProcessModalOpen] = useState<boolean>(false);
  const [uploadProcessDefault, setUploadProcessDefault] = useState<ArchitecturalVisualAsset['type']>('render_3d');
  const [isApproveSheetsModalOpen, setIsApproveSheetsModalOpen] = useState<boolean>(false);

  // Active asset for current view type
  const renderAsset = visualAssets.find((a) => a.type === 'render_3d') || visualAssets[0];
  const cadFloorPlanAsset = visualAssets.find((a) => a.type === 'cad_floor_plan');
  const elevationSectionAsset = visualAssets.find((a) => a.type === 'elevation_section');
  const moodboardAsset = visualAssets.find((a) => a.type === 'material_moodboard');
  const clientRefAsset = visualAssets.find((a) => a.type === 'client_reference');
  const massingAsset = visualAssets.find((a) => a.type === 'massing_schematic');

  const currentAsset =
    activeViewType === 'render_3d'
      ? renderAsset
      : activeViewType === 'cad_floor_plan'
      ? cadFloorPlanAsset
      : activeViewType === 'elevation_section'
      ? elevationSectionAsset
      : activeViewType === 'material_moodboard'
      ? moodboardAsset
      : activeViewType === 'schematic'
      ? massingAsset
      : clientRefAsset;

  const handleOpenLightbox = () => {
    setLightboxCustomImage(null);
    setLightboxZoom(1);
    setIsLightboxOpen(true);
  };

  const handleOpenLightboxWithImage = (imageUrl: string, title: string) => {
    setLightboxCustomImage({ url: imageUrl, title });
    setLightboxZoom(1);
    setIsLightboxOpen(true);
  };

  const handleZoomIn = () => setLightboxZoom((prev) => Math.min(prev + 0.25, 2.5));
  const handleZoomOut = () => setLightboxZoom((prev) => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setLightboxZoom(1);

  // Handlers for asset updates
  const handleUploadAsset = (type: ArchitecturalVisualAsset['type'], fileDataUrl: string, fileName: string) => {
    if (onStageCustomUpload) {
      onStageCustomUpload(type, fileDataUrl, {
        title: fileName.replace(/\.[^/.]+$/, ''),
        subtitle: `Custom uploaded architectural ${type.replace(/_/g, ' ')} asset`,
      });
    } else if (onUpdateVisualAsset) {
      onUpdateVisualAsset(type, {
        imageUrl: fileDataUrl,
        title: fileName.replace(/\.[^/.]+$/, ''),
        subtitle: `Custom uploaded architectural ${type.replace(/_/g, ' ')} asset`,
        approvalStatus: 'draft_pending_approval',
        isCustomUpload: true,
      });
    }
  };

  const handleOpenUploadForCurrentProcess = () => {
    const targetType: ArchitecturalVisualAsset['type'] =
      activeViewType === 'schematic'
        ? 'massing_schematic'
        : (activeViewType as ArchitecturalVisualAsset['type']);
    setUploadProcessDefault(targetType);
    setIsUploadProcessModalOpen(true);
  };

  const hasUnapprovedChanges = Boolean(
    concept.hasUnapprovedDraftSheets ||
    !concept.drawingSheetsApproved ||
    visualAssets.some((a) => a.approvalStatus === 'draft_pending_approval')
  );

  return (
    <div className="space-y-3">
      {/* Architectural Drawing Sheets Governance & Approval Banner */}
      {hasUnapprovedChanges ? (
        <div className="p-3 px-4 rounded-xl bg-amber-500/10 border border-amber-300 text-amber-900 flex flex-wrap items-center justify-between gap-3 shadow-2xs">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center shrink-0">
              <Clock className="w-4 h-4 text-amber-700" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider font-mono text-amber-950">
                  Architectural Drawing Sheets &amp; 3D Presentation
                </span>
                <span className="text-[10px] bg-amber-400 text-slate-950 font-extrabold px-2 py-0.5 rounded shadow-xs">
                  Draft (Pending Approval)
                </span>
                <span className="text-[11px] text-amber-800 font-medium">
                  • Held in memory, not yet saved to permanent baseline
                </span>
              </div>
              <p className="text-xs text-amber-900/80 mt-0.5">
                New drawing sheets or custom uploaded images will NOT be saved to the permanent project baseline until formally approved.
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {onDiscardDraftSheets && (
              <button
                type="button"
                onClick={onDiscardDraftSheets}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-700 bg-white hover:bg-slate-100 border border-slate-300 transition-colors shadow-2xs"
                title="Discard unapproved draft changes and revert to the approved baseline"
              >
                Discard Drafts
              </button>
            )}
            <button
              type="button"
              onClick={() => setIsApproveSheetsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-lg text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-2xs flex items-center space-x-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Approve &amp; Save Sheets</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="p-2.5 px-4 rounded-xl bg-emerald-500/10 border border-emerald-300 text-emerald-900 flex flex-wrap items-center justify-between gap-2 text-xs shadow-2xs">
          <div className="flex items-center space-x-2.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <div className="flex flex-wrap items-center gap-2">
              <span className="font-bold text-emerald-950">
                Architectural Drawing Sheets &amp; 3D Presentation Approved
              </span>
              <span className="text-emerald-700">
                • Saved to project baseline by {concept.drawingSheetsApprovedBy || 'Lead Architect'}
                {concept.drawingSheetsApprovalDate
                  ? ` on ${new Date(concept.drawingSheetsApprovalDate).toLocaleDateString()}`
                  : ''}
              </span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={handleOpenUploadForCurrentProcess}
              className="px-2.5 py-1 rounded-md text-[11px] font-bold text-emerald-900 bg-white hover:bg-emerald-50 border border-emerald-200 transition-colors shadow-2xs flex items-center space-x-1"
            >
              <Upload className="w-3 h-3 text-emerald-600" />
              <span>Upload Revision (Draft)</span>
            </button>
          </div>
        </div>
      )}

      {/* 1. Multi-View Mode Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => setActiveViewType('render_3d')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeViewType === 'render_3d'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Camera className="w-3.5 h-3.5 text-amber-400" />
            <span>3D Perspective Render</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewType('cad_floor_plan')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeViewType === 'cad_floor_plan'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Ruler className="w-3.5 h-3.5 text-indigo-400" />
            <span>CAD Floor Plan Drawing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewType('elevation_section')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeViewType === 'elevation_section'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-400" />
            <span>Section &amp; Elevation Detail</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewType('material_moodboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeViewType === 'material_moodboard'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-amber-500" />
            <span>Material Swatches Moodboard</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewType('client_reference')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeViewType === 'client_reference'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Paperclip className="w-3.5 h-3.5 text-rose-400" />
            <span>Client Sample &amp; Reference</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveViewType('schematic')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors flex items-center space-x-1.5 ${
              activeViewType === 'schematic'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            <Compass className="w-3.5 h-3.5 text-cyan-400" />
            <span>Massing Schematic</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="flex items-center space-x-2">
          {/* Upload Own Image to Process button */}
          <button
            type="button"
            onClick={handleOpenUploadForCurrentProcess}
            className="px-2.5 py-1 text-xs font-bold rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white transition-colors flex items-center space-x-1.5 shadow-2xs"
            title="Upload your own drawings, CAD plans, or 3D renders to the respective process"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload Own Image</span>
          </button>

          {project && (
            <button
              type="button"
              onClick={() => setIsGeminiGeneratorOpen(true)}
              className="px-2.5 py-1 text-xs font-bold rounded-lg bg-amber-400 hover:bg-amber-300 text-slate-950 transition-colors flex items-center space-x-1.5 shadow-2xs"
              title="Generate or update drawing sheet assets using Gemini AI Vision"
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" />
              <span>Gemini AI Synthesizer</span>
            </button>
          )}

          {!isPresentationMode && (
            <button
              type="button"
              onClick={() => setIsAddSampleModalOpen(true)}
              className="px-2.5 py-1 text-xs font-semibold rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 transition-colors flex items-center space-x-1 shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5 text-indigo-600" />
              <span>Attach Drawing / Sample</span>
            </button>
          )}

          {currentAsset && (
            <button
              type="button"
              onClick={handleOpenLightbox}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors shadow-2xs"
              title="Enlarge to full-screen drawing sheet inspection"
            >
              <Maximize2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Specialized Architectural Drawing Sheet Views */}
      {activeViewType === 'render_3d' && (
        <Perspective3DSheet
          concept={concept}
          asset={renderAsset}
          clientName={clientName}
          builtUpAreaSqFt={builtUpAreaSqFt}
          onUploadRender={(dataUrl, name) => handleUploadAsset('render_3d', dataUrl, name)}
          onOpenLightbox={handleOpenLightbox}
          onTriggerGeminiSynthesis={() => setIsGeminiGeneratorOpen(true)}
        />
      )}

      {activeViewType === 'cad_floor_plan' && (
        <CADFloorPlanSheet
          concept={concept}
          asset={cadFloorPlanAsset}
          clientName={clientName}
          builtUpAreaSqFt={builtUpAreaSqFt}
          siteAreaSqFt={project?.siteAreaSqFt}
          roomZones={project?.confirmedRequirements?.roomZones}
          onUploadCAD={(dataUrl, name) => handleUploadAsset('cad_floor_plan', dataUrl, name)}
          onOpenLightbox={handleOpenLightbox}
        />
      )}

      {activeViewType === 'elevation_section' && (
        <SectionElevationSheet
          concept={concept}
          asset={elevationSectionAsset}
          clientName={clientName}
          builtUpAreaSqFt={builtUpAreaSqFt}
          onUploadSection={(dataUrl, name) => handleUploadAsset('elevation_section', dataUrl, name)}
          onOpenLightbox={handleOpenLightbox}
        />
      )}

      {activeViewType === 'material_moodboard' && (
        <MaterialSwatchesSheet
          concept={concept}
          asset={moodboardAsset}
          clientName={clientName}
          onAddMaterial={onAddMaterial}
          onUploadMoodboard={(dataUrl, name) => handleUploadAsset('material_moodboard', dataUrl, name)}
          onOpenLightbox={handleOpenLightbox}
        />
      )}

      {activeViewType === 'client_reference' && (
        <ClientReferenceSheet
          project={project}
          clientName={clientName}
          builtUpAreaSqFt={builtUpAreaSqFt}
          onAddReference={onAddReference}
          onDeleteReference={onDeleteReference}
          onOpenLightboxWithImage={handleOpenLightboxWithImage}
        />
      )}

      {activeViewType === 'schematic' && (
        <MassingSchematicSheet
          concept={concept}
          asset={massingAsset}
          clientName={clientName}
          builtUpAreaSqFt={builtUpAreaSqFt}
          onUploadMassing={(dataUrl, name) => handleUploadAsset('massing_schematic', dataUrl, name)}
          onOpenLightbox={handleOpenLightbox}
        />
      )}

      {/* 3. Global Full-Screen Drawing Sheet Inspection Lightbox Modal */}
      {isLightboxOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="relative w-full h-full max-w-7xl max-h-[92vh] flex flex-col bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-2xl">
            {/* Modal Header Bar */}
            <div className="flex items-center justify-between p-3.5 px-5 bg-slate-900 border-b border-slate-800 text-white shrink-0">
              <div className="flex items-center space-x-3">
                <span className="font-mono font-bold text-amber-400 bg-black/60 px-2 py-0.5 rounded text-xs border border-amber-500/30">
                  {lightboxCustomImage ? 'CLIENT REFERENCE' : currentAsset?.drawingNumber || `DWG-0${concept.optionNumber}`}
                </span>
                <div>
                  <h3 className="text-sm font-bold text-white">
                    {lightboxCustomImage ? lightboxCustomImage.title : currentAsset?.title || concept.title}
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Project: {clientName} • Option {concept.optionNumber}: {concept.themeStyle}
                  </p>
                </div>
              </div>

              {/* Lightbox Controls: Zoom in, Zoom out, Reset, Close */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-1 bg-black/50 p-1 rounded-lg border border-slate-700">
                  <button
                    type="button"
                    onClick={handleZoomOut}
                    className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Zoom Out"
                  >
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-[11px] font-mono px-2 text-amber-300 font-bold">
                    {Math.round(lightboxZoom * 100)}%
                  </span>
                  <button
                    type="button"
                    onClick={handleZoomIn}
                    className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Zoom In"
                  >
                    <ZoomIn className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleResetZoom}
                    className="p-1 rounded text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
                    title="Reset Zoom"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsLightboxOpen(false)}
                  className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors ml-2"
                  title="Close Inspector"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Image Zoom Stage */}
            <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-950 relative select-none">
              <div
                style={{
                  transform: `scale(${lightboxZoom})`,
                  transition: 'transform 0.15s ease-out',
                }}
                className="max-w-full max-h-full flex items-center justify-center origin-center"
              >
                <img
                  src={lightboxCustomImage?.url || currentAsset?.imageUrl || '/biophilic_concept_render.jpg'}
                  alt={lightboxCustomImage?.title || currentAsset?.title || 'Architectural Sheet'}
                  className="max-w-full max-h-[80vh] object-contain rounded-lg shadow-2xl border border-slate-800"
                  referrerPolicy="no-referrer"
                />
              </div>
            </div>

            {/* Modal Footer CAD Details */}
            <div className="p-3 px-5 bg-slate-900 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400 shrink-0">
              <span>
                Architectural Drawing Sheet Inspection • <strong>{clientName}</strong>
              </span>
              <span className="font-mono text-slate-500">
                Built-up: {builtUpAreaSqFt.toLocaleString()} sq.ft • ArchCRM Professional Suite
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Attach Sample Data Modal */}
      {isAddSampleModalOpen && onAttachSampleData && (
        <AddSampleDataModal
          isOpen={isAddSampleModalOpen}
          onClose={() => setIsAddSampleModalOpen(false)}
          onAddSample={(sample) => {
            onAttachSampleData(sample);
            setIsAddSampleModalOpen(false);
          }}
          conceptTitle={concept.title}
        />
      )}

      {/* Gemini AI Asset Generator Modal */}
      {isGeminiGeneratorOpen && project && (
        <GeminiAssetGeneratorModal
          isOpen={isGeminiGeneratorOpen}
          onClose={() => setIsGeminiGeneratorOpen(false)}
          concept={concept}
          project={project}
          initialSheetType={
            activeViewType === 'schematic' ? 'render_3d' : (activeViewType as ArchitecturalVisualAsset['type'])
          }
          onSuccess={(newImageUrl, source) => {
            if (onUpdateVisualAsset) {
              onUpdateVisualAsset(activeViewType === 'schematic' ? 'render_3d' : activeViewType, {
                imageUrl: newImageUrl,
                subtitle: `Synthesized with ${source} • ${new Date().toLocaleTimeString()}`,
              });
            }
          }}
        />
      )}

      {/* Upload Own Image to Specific Process Modal */}
      {isUploadProcessModalOpen && (
        <UploadProcessImageModal
          isOpen={isUploadProcessModalOpen}
          onClose={() => setIsUploadProcessModalOpen(false)}
          defaultProcess={uploadProcessDefault}
          conceptNumber={concept.optionNumber}
          conceptTitle={concept.title}
          onStageUpload={(sheetType, fileDataUrl, metadata) => {
            if (onStageCustomUpload) {
              onStageCustomUpload(sheetType, fileDataUrl, metadata);
            } else if (onUpdateVisualAsset) {
              onUpdateVisualAsset(sheetType, {
                imageUrl: fileDataUrl,
                title: metadata.title,
                drawingNumber: metadata.drawingNumber,
                subtitle: metadata.subtitle,
                caption: metadata.caption,
                scale: metadata.scale,
                revision: metadata.revision,
                tags: metadata.tags,
                isCustomUpload: true,
                approvalStatus: 'draft_pending_approval',
              });
            }
            // Automatically switch viewer tab to newly uploaded process
            if (sheetType === 'massing_schematic') {
              setActiveViewType('schematic');

            } else {
              setActiveViewType(sheetType as any);
            }
          }}
        />
      )}

      {/* Formal Approval of Drawing Sheets & 3D Presentations Governance Modal */}
      {isApproveSheetsModalOpen && (
        <ApproveDrawingSheetsModal
          isOpen={isApproveSheetsModalOpen}
          onClose={() => setIsApproveSheetsModalOpen(false)}
          concept={concept}
          clientName={clientName}
          onConfirmApproval={(approverName, approverRole, notes) => {
            if (onApproveDrawingSheets) {
              onApproveDrawingSheets(approverName, approverRole, notes);
            }
          }}
        />
      )}
    </div>
  );
};
