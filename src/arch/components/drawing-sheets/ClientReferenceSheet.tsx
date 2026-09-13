import React, { useState } from 'react';
import {
  Paperclip,
  CheckCircle2,
  Upload,
  Plus,
  Trash2,
  Maximize2,
  ExternalLink,
  Tag,
  ShieldCheck,
  Calendar,
  Building2,
  MapPin,
  Sparkles,
  X,
  FileImage,
} from 'lucide-react';
import { ProjectCustomer, SampleInspirationData } from '../../types';
import { SAMPLE_CLIENT_INSPIRATIONS } from '../../data/architecturalAssets';

interface ClientReferenceSheetProps {
  project?: ProjectCustomer;
  clientName: string;
  builtUpAreaSqFt: number;
  onAddReference?: (item: Omit<SampleInspirationData, 'id'>) => void;
  onDeleteReference?: (id: string) => void;
  onOpenLightboxWithImage?: (imageUrl: string, title: string) => void;
}

export const ClientReferenceSheet: React.FC<ClientReferenceSheetProps> = ({
  project,
  clientName,
  builtUpAreaSqFt,
  onAddReference,
  onDeleteReference,
  onOpenLightboxWithImage,
}) => {
  const [isUploadModalOpen, setIsUploadModalOpen] = useState<boolean>(false);
  const [selectedTag, setSelectedTag] = useState<string>('All');

  // Form states
  const [newTitle, setNewTitle] = useState<string>('');
  const [newSource, setNewSource] = useState<string>('Client Brief Upload');
  const [newDescription, setNewDescription] = useState<string>('');
  const [newImageUrl, setNewImageUrl] = useState<string>('');
  const [newTagsStr, setNewTagsStr] = useState<string>('Client Brief, Interior Mood');

  // Combine project-specific custom uploaded references with curated client inspirations
  const projectReferences = project?.customerReferences || [];
  const allReferences = [...projectReferences, ...SAMPLE_CLIENT_INSPIRATIONS];

  // Extract all unique tags
  const allTags = [
    'All',
    ...Array.from(new Set(allReferences.flatMap((r) => r.tags || []))),
  ];

  const filteredReferences = selectedTag === 'All'
    ? allReferences
    : allReferences.filter((r) => r.tags?.includes(selectedTag));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setNewImageUrl(event.target.result as string);
          if (!newTitle) {
            setNewTitle(file.name.replace(/\.[^/.]+$/, ''));
          }
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmitReference = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim() || !newImageUrl.trim()) return;

    if (onAddReference) {
      onAddReference({
        clientName,
        title: newTitle.trim(),
        source: newSource,
        description: newDescription.trim() || 'Client-submitted reference file verifying spatial requirements.',
        imageUrl: newImageUrl,
        tags: newTagsStr.split(',').map((t) => t.trim()).filter(Boolean),
        createdAt: new Date().toISOString(),
      });
    }

    setNewTitle('');
    setNewDescription('');
    setNewImageUrl('');
    setIsUploadModalOpen(false);
  };

  return (
    <div className="space-y-4">
      {/* 1. Customer Requirements Verified Brief Summary Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs">
        <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                Customer Requirements Brief &amp; Baseline Specifications
              </h3>
              <p className="text-xs text-slate-500">
                Authentic design inputs, room allocations, and constraints confirmed with {clientName}
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center space-x-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Requirements Confirmed</span>
            </span>
            <button
              type="button"
              onClick={() => setIsUploadModalOpen(true)}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold shadow-xs transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Attach Customer Reference File</span>
            </button>
          </div>
        </div>

        {/* Detailed Brief Parameters Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 text-xs">
          {/* Vision */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Project Vision &amp; Narrative
            </span>
            <p className="text-slate-800 font-medium leading-relaxed">
              {project?.confirmedRequirements?.projectVision ||
                'Sophisticated architectural design prioritizing seamless indoor-outdoor transition, acoustic sanctuary, and high-performance tactile materials.'}
            </p>
          </div>

          {/* Room Zones */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Confirmed Room Zones
            </span>
            <div className="flex flex-wrap gap-1">
              {(project?.confirmedRequirements?.roomZones || [
                'Grand Foyer',
                'Living Forum',
                'Show Kitchen',
                'Master Sanctum',
                'Study Library',
              ]).map((zone, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-white border border-slate-200 text-slate-700 text-[11px] font-semibold"
                >
                  {zone}
                </span>
              ))}
            </div>
          </div>

          {/* Style Preferences */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Style Preferences
            </span>
            <div className="flex flex-wrap gap-1">
              {(project?.confirmedRequirements?.stylePreferences || [
                'Contemporary Minimalist',
                'Biophilic Integration',
                'Nordic Warmth',
              ]).map((pref, i) => (
                <span
                  key={i}
                  className="px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-200 text-indigo-800 text-[11px] font-semibold"
                >
                  {pref}
                </span>
              ))}
            </div>
          </div>

          {/* Technical Constraints */}
          <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-1">
              Special Constraints
            </span>
            <p className="text-slate-800 font-medium">
              {project?.confirmedRequirements?.specialConstraints ||
                'STC-55 acoustic partition walls in Master suite, LEED v4 low-VOC finishes, maximum natural daylight integration.'}
            </p>
          </div>
        </div>
      </div>

      {/* 2. Customer Files & Inspiration Photos Gallery */}
      <div className="space-y-3">
        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-700 flex items-center mr-1">
              <Paperclip className="w-3.5 h-3.5 mr-1 text-slate-500" />
              Customer Reference Files ({filteredReferences.length}):
            </span>
            {allTags.slice(0, 7).map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => setSelectedTag(tag)}
                className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  selectedTag === tag
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {/* Reference Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredReferences.map((item, idx) => (
            <div
              key={item.id || idx}
              className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Image Preview with hover overlay */}
                <div
                  className="relative aspect-16/10 bg-slate-900 overflow-hidden cursor-pointer"
                  onClick={() =>
                    onOpenLightboxWithImage && onOpenLightboxWithImage(item.imageUrl, item.title)
                  }
                >
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />

                  {/* Source Badge */}
                  <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md text-[10px] font-bold font-mono uppercase tracking-wider bg-black/70 text-amber-300 border border-amber-500/30 backdrop-blur-md">
                    {item.source}
                  </span>

                  {/* Enlarge Hint */}
                  <button
                    type="button"
                    className="absolute top-2.5 right-2.5 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md transition-colors opacity-0 group-hover:opacity-100"
                    title="Enlarge reference image"
                  >
                    <Maximize2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="p-3.5 space-y-2">
                  <h4 className="text-xs font-bold text-slate-900 leading-tight">
                    {item.title}
                  </h4>
                  <p className="text-xs text-slate-600 line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Card Footer: Tags & Delete */}
              <div className="p-3.5 pt-0 flex items-center justify-between border-t border-slate-100 mt-2">
                <div className="flex flex-wrap gap-1">
                  {item.tags?.slice(0, 3).map((tag, tidx) => (
                    <span
                      key={tidx}
                      className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-100 text-slate-600"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>

                {onDeleteReference && item.id.startsWith('insp-') && item.id.length > 8 && (
                  <button
                    type="button"
                    onClick={() => onDeleteReference(item.id)}
                    className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Remove reference file"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Upload / Attach Reference Modal */}
      {isUploadModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-slate-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
              <div className="flex items-center space-x-2">
                <FileImage className="w-5 h-5 text-indigo-600" />
                <h3 className="text-sm font-bold text-slate-900">
                  Attach Customer Reference File / Survey
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUploadModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitReference} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Source / Document Type
                </label>
                <select
                  value={newSource}
                  onChange={(e) => setNewSource(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                >
                  <option value="Client Brief Upload">Client Brief Upload / Moodboard</option>
                  <option value="Site Dimension Survey">Site Laser Dimension Survey</option>
                  <option value="Showroom Benchmark">Showroom Benchmark Reference</option>
                  <option value="Municipal Baseline">Municipal Property Baseline</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Reference File / Image
                </label>
                <div className="space-y-2">
                  <label className="flex flex-col items-center justify-center border-2 border-dashed border-slate-300 hover:border-indigo-500 rounded-xl p-4 cursor-pointer bg-slate-50 transition-colors">
                    <Upload className="w-6 h-6 text-slate-400 mb-1" />
                    <span className="text-xs font-semibold text-slate-700">
                      Click to browse or drop drawing / photo file
                    </span>
                    <span className="text-[10px] text-slate-500 mt-0.5">
                      JPG, PNG, WEBP, or SVG
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Or Image URL:</span>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newImageUrl}
                      onChange={(e) => setNewImageUrl(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                    />
                  </div>

                  {newImageUrl && (
                    <div className="relative aspect-16/9 rounded-lg overflow-hidden border border-slate-200">
                      <img src={newImageUrl} alt="Preview" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Title / Subject Callout
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Double-Height Lightwell Reference from Vancouver Project"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Design Notes &amp; Verification Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Notes on client requirements represented in this photo..."
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Tags (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Lightwell, Oak Slats, Daylight"
                  value={newTagsStr}
                  onChange={(e) => setNewTagsStr(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsUploadModalOpen(false)}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!newTitle.trim() || !newImageUrl.trim()}
                  className="px-4 py-1.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg shadow-xs disabled:opacity-50"
                >
                  Save Reference Document
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
