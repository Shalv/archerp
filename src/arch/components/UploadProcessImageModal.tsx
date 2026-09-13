import React, { useState, useRef } from 'react';
import {
  Upload,
  X,
  FileImage,
  CheckCircle2,
  Camera,
  Ruler,
  Layers,
  Palette,
  Compass,
  Paperclip,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { ArchitecturalVisualAsset } from '../types';

interface UploadProcessImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  conceptNumber: number;
  conceptTitle: string;
  defaultProcess?: ArchitecturalVisualAsset['type'];
  onStageUpload: (
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
}

const PROCESS_OPTIONS: {
  id: ArchitecturalVisualAsset['type'];
  name: string;
  icon: React.ElementType;
  color: string;
  sheetPrefix: string;
  defaultScale: string;
  description: string;
}[] = [
  {
    id: 'render_3d',
    name: '3D Perspective Render',
    icon: Camera,
    color: 'text-amber-500 bg-amber-500/10 border-amber-300',
    sheetPrefix: 'RND-3D',
    defaultScale: 'Perspective View',
    description: 'Photorealistic exterior/interior perspective renders and walkthroughs',
  },
  {
    id: 'cad_floor_plan',
    name: 'CAD Architectural Floor Plan',
    icon: Ruler,
    color: 'text-indigo-600 bg-indigo-500/10 border-indigo-300',
    sheetPrefix: 'DWG-A10',
    defaultScale: '1:100 @ A3',
    description: 'Technical CAD layout with room zoning, dimensions, and partition walls',
  },
  {
    id: 'elevation_section',
    name: 'Section & Elevation Detail',
    icon: Layers,
    color: 'text-emerald-600 bg-emerald-500/10 border-emerald-300',
    sheetPrefix: 'DWG-SEC-20',
    defaultScale: '1:50 @ A3',
    description: 'Vertical building cross-sections, ceiling heights, and facade elevations',
  },
  {
    id: 'material_moodboard',
    name: 'Material Swatches & Finishes',
    icon: Palette,
    color: 'text-amber-600 bg-amber-600/10 border-amber-300',
    sheetPrefix: 'MAT-MB-0',
    defaultScale: 'Swatches & Textures',
    description: 'Material palette moodboards, physical sample collages, and surface textures',
  },
  {
    id: 'massing_schematic',
    name: 'Massing Schematic / Axonometric',
    icon: Compass,
    color: 'text-cyan-600 bg-cyan-500/10 border-cyan-300',
    sheetPrefix: 'SCH-VOL-0',
    defaultScale: 'Axonometric 1:200',
    description: 'Volumetric massing diagrams, solar study axonometrics, and spatial blocks',
  },
  {
    id: 'client_reference',
    name: 'Client Reference & Site Survey',
    icon: Paperclip,
    color: 'text-rose-600 bg-rose-500/10 border-rose-300',
    sheetPrefix: 'REF-SITE-0',
    defaultScale: 'Reference Photo',
    description: 'Client inspiration images, site survey snapshots, and mood clippings',
  },
];

export const UploadProcessImageModal: React.FC<UploadProcessImageModalProps> = ({
  isOpen,
  onClose,
  conceptNumber,
  conceptTitle,
  defaultProcess = 'render_3d',
  onStageUpload,
}) => {
  const [selectedProcess, setSelectedProcess] = useState<ArchitecturalVisualAsset['type']>(defaultProcess);
  const [dragOver, setDragOver] = useState<boolean>(false);
  const [fileDataUrl, setFileDataUrl] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [title, setTitle] = useState<string>('');
  const [drawingNumber, setDrawingNumber] = useState<string>('');
  const [caption, setCaption] = useState<string>('');
  const [scale, setScale] = useState<string>('1:50 @ A3');
  const [revision, setRevision] = useState<string>('Rev P1');

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentProcessConfig =
    PROCESS_OPTIONS.find((p) => p.id === selectedProcess) || PROCESS_OPTIONS[0];

  const handleProcessSelect = (processId: ArchitecturalVisualAsset['type']) => {
    setSelectedProcess(processId);
    const proc = PROCESS_OPTIONS.find((p) => p.id === processId);
    if (proc) {
      setDrawingNumber(`${proc.sheetPrefix}${conceptNumber}`);
      setScale(proc.defaultScale);
      if (!title || title.includes('Sheet') || title.includes('Render')) {
        setTitle(`${proc.name} — Option ${conceptNumber}`);
      }
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (PNG, JPG, WEBP, or SVG).');
      return;
    }
    setFileName(file.name);
    const inferredTitle = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
    if (!title) {
      setTitle(inferredTitle);
    }
    if (!drawingNumber) {
      setDrawingNumber(`${currentProcessConfig.sheetPrefix}${conceptNumber}`);
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        setFileDataUrl(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fileDataUrl) {
      alert('Please select or drop an image file first.');
      return;
    }

    onStageUpload(selectedProcess, fileDataUrl, {
      title: title.trim() || `${currentProcessConfig.name} — Option ${conceptNumber}`,
      drawingNumber: drawingNumber.trim() || `${currentProcessConfig.sheetPrefix}${conceptNumber}`,
      subtitle: `Custom uploaded sheet for ${currentProcessConfig.name} • Option ${conceptNumber}`,
      caption: caption.trim() || `Custom uploaded architectural drawing sheet for ${currentProcessConfig.name}.`,
      scale: scale.trim() || currentProcessConfig.defaultScale,
      revision: revision.trim() || 'Rev P1',
      tags: ['Custom Upload', currentProcessConfig.name, 'Draft'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="p-5 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-400/20 border border-amber-400/30 flex items-center justify-center">
              <Upload className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-amber-400 font-mono">
                Architectural Drawing Sheet Upload
              </span>
              <h2 className="text-base font-bold text-white mt-0.5">
                Upload Custom Image to Drawing Process
              </h2>
              <p className="text-xs text-slate-300">
                Option {conceptNumber}: {conceptTitle}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-5">
          {/* 1. Step 1: Select Target Process */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              1. Select Respective Architectural Process
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {PROCESS_OPTIONS.map((proc) => {
                const Icon = proc.icon;
                const isSelected = selectedProcess === proc.id;
                return (
                  <button
                    key={proc.id}
                    type="button"
                    onClick={() => handleProcessSelect(proc.id)}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/70 ring-2 ring-indigo-500/20 shadow-xs'
                        : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <div className={`p-1.5 rounded-lg border ${proc.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <span className="text-xs font-bold text-slate-900 leading-tight">
                        {proc.name}
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 mt-2 line-clamp-2">
                      {proc.description}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Step 2: Drag & Drop or Browse Image */}
          <div>
            <label className="text-xs font-bold text-slate-800 uppercase tracking-wider block mb-2">
              2. Upload Drawing Image File (Drag &amp; Drop or Browse)
            </label>
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                dragOver
                  ? 'border-indigo-500 bg-indigo-50/50 scale-[1.01]'
                  : fileDataUrl
                  ? 'border-emerald-300 bg-emerald-50/30'
                  : 'border-slate-300 hover:border-slate-400 bg-slate-50/50'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />

              {fileDataUrl ? (
                <div className="space-y-3">
                  <div className="relative inline-block max-h-44 overflow-hidden rounded-xl border border-slate-300 shadow-xs">
                    <img
                      src={fileDataUrl}
                      alt="Uploaded preview"
                      className="max-h-44 w-auto object-contain mx-auto"
                    />
                    <div className="absolute top-2 right-2 bg-emerald-600 text-white p-1 rounded-full shadow-md">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {fileName || 'Custom Drawing Selected'}
                    </span>
                    <span className="text-[11px] text-indigo-600 font-semibold hover:underline">
                      Click to replace with a different image
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-600 flex items-center justify-center mx-auto">
                    <FileImage className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">
                      Drop your {currentProcessConfig.name} image here
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      or <span className="text-indigo-600 font-semibold underline">browse files</span> from your computer
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400 font-mono">
                    Supports high-resolution JPG, PNG, WEBP, and SVG drawings
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* 3. Step 3: Drawing Metadata */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Drawing Sheet Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder={`e.g. Master Living Atrium ${currentProcessConfig.name}`}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Sheet Reference Number
              </label>
              <input
                type="text"
                value={drawingNumber}
                onChange={(e) => setDrawingNumber(e.target.value)}
                placeholder={`e.g. ${currentProcessConfig.sheetPrefix}${conceptNumber}`}
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Drawing Scale
              </label>
              <input
                type="text"
                value={scale}
                onChange={(e) => setScale(e.target.value)}
                placeholder="e.g. 1:100 @ A3 or Perspective"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Revision Tag
              </label>
              <input
                type="text"
                value={revision}
                onChange={(e) => setRevision(e.target.value)}
                placeholder="e.g. Rev P1 (Draft)"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Drawing Sheet Notes &amp; Specification Details
              </label>
              <textarea
                rows={2}
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                placeholder="Enter any specific finish specs, orientation notes, or architectural annotations for this sheet..."
                className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Staging Warning */}
          <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-start space-x-2 text-xs text-amber-800">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold block">Approval Governance Notice:</span>
              <span>
                This custom image will be staged in <strong>Draft mode</strong> and will <strong>NOT be saved to the permanent project baseline</strong> until you approve the drawing sheets.
              </span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2 pt-2 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!fileDataUrl}
              className="px-5 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white transition-colors shadow-xs disabled:opacity-50 flex items-center space-x-1.5"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Stage to {currentProcessConfig.name}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
