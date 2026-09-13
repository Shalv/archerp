import React, { useState } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  Check,
  FileText,
  Sparkles,
  Link,
  Layers,
} from 'lucide-react';
import { SAMPLE_CLIENT_INSPIRATIONS, SampleInspirationData } from '../data/architecturalAssets';

interface AddSampleDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSample: (sample: {
    title: string;
    description: string;
    imageUrl: string;
    sourceType: 'client_upload' | 'sample_data' | 'site_survey';
    tags: string[];
  }) => void;
  conceptTitle: string;
}

export const AddSampleDataModal: React.FC<AddSampleDataModalProps> = ({
  isOpen,
  onClose,
  onAddSample,
  conceptTitle,
}) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'sample_library' | 'url'>('sample_library');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [sourceType, setSourceType] = useState<'client_upload' | 'sample_data' | 'site_survey'>('sample_data');
  const [tagsInput, setTagsInput] = useState('');
  const [selectedPresetId, setSelectedPresetId] = useState<string | null>(null);
  const [previewError, setPreviewError] = useState(false);

  if (!isOpen) return null;

  const handleSelectPreset = (preset: SampleInspirationData) => {
    setSelectedPresetId(preset.id);
    setTitle(preset.title);
    setDescription(preset.description);
    setImageUrl(preset.imageUrl);
    setTagsInput(preset.tags.join(', '));
    setSourceType(preset.source.includes('Survey') ? 'site_survey' : 'sample_data');
    setPreviewError(false);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImageUrl(result);
      if (!title) {
        setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
      }
      setSourceType('client_upload');
      setPreviewError(false);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    const tags = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    onAddSample({
      title: title || 'Architectural Reference Drawing',
      description: description || 'Client-provided sample data for concept styling.',
      imageUrl,
      sourceType,
      tags: tags.length > 0 ? tags : ['Reference Asset'],
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono">
                Visual Context Engine
              </span>
              <span className="text-xs text-slate-400">•</span>
              <span className="text-xs text-slate-500 font-medium">Customer &amp; Site Media</span>
            </div>
            <h2 className="text-lg font-bold text-slate-900 mt-1">
              Attach Drawing or Sample Reference Image
            </h2>
            <p className="text-xs text-slate-500">
              Provide actual drawings, site survey sketches, or customer moodboard samples for <span className="font-semibold text-slate-700">{conceptTitle}</span>.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Source Navigation Tabs */}
        <div className="px-5 pt-3 border-b border-slate-200 flex space-x-2 bg-white">
          <button
            type="button"
            onClick={() => setActiveTab('sample_library')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'sample_library'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Architect Samples</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'upload'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Upload className="w-3.5 h-3.5" />
            <span>Upload File / Drawing</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('url')}
            className={`pb-2.5 px-3 text-xs font-semibold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'url'
                ? 'border-indigo-600 text-indigo-600'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <Link className="w-3.5 h-3.5" />
            <span>Image / Drawing URL</span>
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Tab 1: Curated Samples */}
          {activeTab === 'sample_library' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Select from Curated Architectural &amp; Site Benchmarks:
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {SAMPLE_CLIENT_INSPIRATIONS.map((preset) => {
                  const isSelected = selectedPresetId === preset.id;
                  return (
                    <button
                      key={preset.id}
                      type="button"
                      onClick={() => handleSelectPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all relative flex flex-col h-full ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/20'
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="w-full h-24 rounded-lg overflow-hidden bg-slate-100 mb-2 relative">
                        <img
                          src={preset.imageUrl}
                          alt={preset.title}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                        {isSelected && (
                          <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-xs">
                            <Check className="w-3 h-3" />
                          </span>
                        )}
                      </div>
                      <span className="text-[10px] font-bold text-indigo-700 font-mono block">
                        {preset.source}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 leading-tight mt-0.5 line-clamp-2">
                        {preset.title}
                      </h4>
                      <p className="text-[10px] text-slate-500 mt-1 line-clamp-2">
                        {preset.description}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Tab 2: Upload File */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Upload Architectural Drawing, CAD Export, or Customer Photo:
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-indigo-400 rounded-xl p-6 text-center bg-slate-50/50 transition-colors">
                <input
                  type="file"
                  id="drawing-file-input"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <label
                  htmlFor="drawing-file-input"
                  className="cursor-pointer flex flex-col items-center justify-center space-y-2"
                >
                  <div className="w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center">
                    <Upload className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-indigo-600 hover:underline">
                      Click to choose an image file
                    </span>
                    <span className="text-xs text-slate-500"> or drag and drop</span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    PNG, JPG, WEBP, or SVG architectural drawings &amp; renders (up to 10MB)
                  </p>
                </label>
              </div>
            </div>
          )}

          {/* Tab 3: URL Input */}
          {activeTab === 'url' && (
            <div className="space-y-3">
              <label className="text-xs font-bold text-slate-700 block">
                Direct Image or Web-Hosted Drawing URL:
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="url"
                  placeholder="https://example.com/drawings/floor-plan-option-1.jpg"
                  value={imageUrl}
                  onChange={(e) => {
                    setImageUrl(e.target.value);
                    setPreviewError(false);
                  }}
                  className="w-full text-xs p-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-1 focus:ring-indigo-500 bg-white font-mono"
                />
              </div>
            </div>
          )}

          {/* Live Preview Box */}
          {imageUrl && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[11px] font-bold text-slate-700 flex items-center space-x-1.5">
                  <ImageIcon className="w-3.5 h-3.5 text-indigo-600" />
                  <span>Image Preview</span>
                </span>
                <span className="text-[10px] text-slate-400">Ready to link</span>
              </div>
              <div className="w-full h-40 rounded-lg overflow-hidden bg-slate-200 relative border border-slate-200">
                {!previewError ? (
                  <img
                    src={imageUrl}
                    alt="Preview"
                    onError={() => setPreviewError(true)}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 text-xs p-4 text-center">
                    <FileText className="w-6 h-6 mb-1" />
                    <span>Unable to load image preview from this URL. Please verify the URL or upload a file.</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Metadata Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-100">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Deliverable Title
              </label>
              <input
                type="text"
                placeholder="e.g. Master Bedroom Joinery Elevation"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
                required
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">
                Source Classification
              </label>
              <select
                value={sourceType}
                onChange={(e) => setSourceType(e.target.value as any)}
                className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
              >
                <option value="client_upload">Customer Provided Reference</option>
                <option value="sample_data">Architect Sample Benchmark</option>
                <option value="site_survey">Site Survey &amp; As-Built Drawing</option>
              </select>
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Architectural &amp; Design Intent Notes
            </label>
            <textarea
              rows={2}
              placeholder="Describe how this drawing or reference informs materials, daylighting, or spatial flow..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              placeholder="e.g. Floor Plan, White Oak, Lightwell, Client Feedback"
              value={tagsInput}
              onChange={(e) => setTagsInput(e.target.value)}
              className="w-full text-xs p-2 rounded-lg border border-slate-300 bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!imageUrl}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-slate-900 text-white hover:bg-slate-800 disabled:opacity-50 transition-colors shadow-xs flex items-center space-x-1.5"
            >
              <Check className="w-3.5 h-3.5 text-amber-400" />
              <span>Attach Deliverable to Option</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
