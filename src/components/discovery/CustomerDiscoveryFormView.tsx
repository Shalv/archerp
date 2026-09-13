import React, { useState } from 'react';
import {
  User,
  Building,
  Home,
  Layers,
  Palette,
  DollarSign,
  FileCheck,
  Sparkles,
  CheckCircle2,
  Plus,
  Trash2,
  Share2,
  Save,
  Compass,
  Sliders,
  Utensils,
  Shield,
  HelpCircle,
  ExternalLink,
  Phone,
  Mail,
  MapPin,
  Calendar,
  Eye
} from 'lucide-react';
import { CustomerDiscoveryData } from '../../data/discoveryAndSampleHeadsData';
import { ProjectRecord } from '../../types/erp';

interface CustomerDiscoveryFormViewProps {
  discoveryData: CustomerDiscoveryData;
  onSaveDiscoveryData: (updated: CustomerDiscoveryData) => void;
  onGenerateAIOptions: () => void;
  onNavigateToPack: () => void;
  project: ProjectRecord;
}

const ALL_PROJECT_TYPES = [
  'Residential house',
  'Villa',
  'Apartment',
  'Farmhouse',
  'Office',
  'Retail showroom',
  'Restaurant/café',
  'Hotel',
  'School/university',
  'Hospital/clinic',
  'Commercial building',
  'Industrial building',
  'Renovation/remodelling',
  'Construction from scratch',
  'Interior-only project',
  'Architecture and interior combined'
];

const ALL_STYLE_OPTIONS = [
  'Modern',
  'Contemporary',
  'Minimalist',
  'Luxury',
  'Scandinavian',
  'Industrial',
  'Traditional',
  'Indian ethnic',
  'Japandi',
  'Bohemian',
  'Classic',
  'Neoclassical',
  'Rustic',
  'Resort-style',
  'Corporate',
  'Premium retail'
];

export const CustomerDiscoveryFormView: React.FC<CustomerDiscoveryFormViewProps> = ({
  discoveryData,
  onSaveDiscoveryData,
  onGenerateAIOptions,
  onNavigateToPack,
  project
}) => {
  const [formData, setFormData] = useState<CustomerDiscoveryData>(discoveryData);
  const [activeSection, setActiveSection] = useState<'ALL' | 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H'>('ALL');
  const [toastText, setToastText] = useState<string | null>(null);

  const showToast = (text: string) => {
    setToastText(text);
    setTimeout(() => setToastText(null), 3500);
  };

  const handleSave = () => {
    onSaveDiscoveryData(formData);
    showToast('Customer discovery requirements saved successfully!');
  };

  const handleToggleProjectType = (type: string) => {
    setFormData(prev => {
      const exists = prev.projectTypes.includes(type);
      return {
        ...prev,
        projectTypes: exists ? prev.projectTypes.filter(t => t !== type) : [...prev.projectTypes, type]
      };
    });
  };

  const handleToggleStyle = (style: string) => {
    setFormData(prev => {
      const exists = prev.selectedStyles.includes(style);
      return {
        ...prev,
        selectedStyles: exists ? prev.selectedStyles.filter(s => s !== style) : [...prev.selectedStyles, style]
      };
    });
  };

  const handleAddRoom = () => {
    const newRoom = {
      id: `room-${Date.now()}`,
      areaName: 'New Space / Room',
      dimensions: '15ft x 12ft',
      requiredFurniture: 'Custom furniture according to functional brief',
      storageRequirements: 'Modular wardrobe & storage cabinets',
      lightingRequirements: 'Cove ambient lighting with task downlights',
      electricalPlumbingPoints: 'Standard 6A/16A points',
      preferredMaterials: 'Matte laminate, quartz, vitrified tiles',
      colourPreferences: 'Warm neutral tones',
      specialNeeds: 'Acoustic treatment',
      budgetPriority: 'MEDIUM' as const
    };
    setFormData(prev => ({
      ...prev,
      roomRequirements: [...prev.roomRequirements, newRoom]
    }));
  };

  const handleRemoveRoom = (id: string) => {
    setFormData(prev => ({
      ...prev,
      roomRequirements: prev.roomRequirements.filter(r => r.id !== id)
    }));
  };

  const handleUpdateRoom = (id: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      roomRequirements: prev.roomRequirements.map(r => r.id === id ? { ...r, [field]: value } : r)
    }));
  };

  return (
    <div className="space-y-6">
      {/* Toast */}
      {toastText && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#0F6CBD] text-white px-4 py-2.5 rounded shadow-lg flex items-center gap-2 text-xs font-semibold animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-300" />
          <span>{toastText}</span>
        </div>
      )}

      {/* Header Bar */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-[#0F6CBD] text-white text-xs font-mono font-bold px-2.5 py-0.5 rounded">
              Pillar 1: Discovery Studio
            </span>
            <h2 className="text-base font-bold text-slate-900">
              Structured Customer Discovery &amp; Requirements Intake
            </h2>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Capturing detailed client parameters (Sections A–H) to drive automated 3D sample images, 4–5 AI design concepts, BOQ, and budget calculations.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 text-xs font-bold transition shadow-xs"
          >
            <Save className="w-3.5 h-3.5 text-[#0F6CBD]" />
            <span>Save Discovery</span>
          </button>
          <button
            type="button"
            onClick={onNavigateToPack}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-purple-50 text-purple-700 border border-purple-200 hover:bg-purple-100 text-xs font-bold transition shadow-xs"
          >
            <Share2 className="w-3.5 h-3.5 text-purple-600" />
            <span>Preview Client Info Pack</span>
          </button>
          <button
            type="button"
            onClick={() => {
              handleSave();
              onGenerateAIOptions();
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-emerald-600 text-white hover:bg-emerald-700 text-xs font-bold transition shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Synthesize AI Options &amp; Images</span>
          </button>
        </div>
      </div>

      {/* Quick Jump Navigation */}
      <div className="bg-slate-100/80 p-1.5 rounded-lg border border-slate-200 flex items-center gap-1.5 overflow-x-auto text-xs font-medium">
        <span className="text-[11px] font-bold text-slate-500 px-2 uppercase tracking-wider shrink-0">Sections:</span>
        <button
          onClick={() => setActiveSection('ALL')}
          className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeSection === 'ALL' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}
        >
          All Sections
        </button>
        <button
          onClick={() => setActiveSection('A')}
          className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeSection === 'A' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}
        >
          A. Customer Details
        </button>
        <button
          onClick={() => setActiveSection('B')}
          className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeSection === 'B' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}
        >
          B. Project Type ({formData.projectTypes.length})
        </button>
        <button
          onClick={() => setActiveSection('C')}
          className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeSection === 'C' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}
        >
          C. Property &amp; Site
        </button>
        <button
          onClick={() => setActiveSection('D')}
          className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeSection === 'D' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}
        >
          D. Rooms &amp; Kitchen ({formData.roomRequirements.length})
        </button>
        <button
          onClick={() => setActiveSection('E')}
          className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeSection === 'E' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}
        >
          E. Lifestyle &amp; Vastu
        </button>
        <button
          onClick={() => setActiveSection('F')}
          className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeSection === 'F' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}
        >
          F. Style &amp; Finishes
        </button>
        <button
          onClick={() => setActiveSection('G')}
          className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeSection === 'G' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}
        >
          G. Budget &amp; Commercials
        </button>
        <button
          onClick={() => setActiveSection('H')}
          className={`px-2.5 py-1 rounded transition whitespace-nowrap ${activeSection === 'H' ? 'bg-white text-slate-900 font-bold shadow-xs' : 'text-slate-600 hover:bg-slate-200/60'}`}
        >
          H. Documents &amp; Pinterest Links
        </button>
      </div>

      {/* SECTION A: BASIC CUSTOMER DETAILS */}
      {(activeSection === 'ALL' || activeSection === 'A') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <User className="w-4 h-4 text-[#0F6CBD]" />
            <h3 className="font-bold text-slate-900 text-sm">
              A. Basic Customer &amp; Decision-Maker Details
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Customer / Company Name</label>
              <input
                type="text"
                value={formData.customerName}
                onChange={e => setFormData({ ...formData, customerName: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Primary Contact Person</label>
              <input
                type="text"
                value={formData.contactPerson}
                onChange={e => setFormData({ ...formData, contactPerson: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Mobile &amp; WhatsApp Number</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.mobile}
                  onChange={e => setFormData({ ...formData, mobile: e.target.value })}
                  placeholder="Mobile"
                  className="w-1/2 px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
                />
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={e => setFormData({ ...formData, whatsapp: e.target.value })}
                  placeholder="WhatsApp"
                  className="w-1/2 px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
              <input
                type="email"
                value={formData.email}
                onChange={e => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Project Site Location</label>
              <input
                type="text"
                value={formData.projectLocation}
                onChange={e => setFormData({ ...formData, projectLocation: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Preferred Communication</label>
              <select
                value={formData.preferredCommunication}
                onChange={e => setFormData({ ...formData, preferredCommunication: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none bg-white"
              >
                <option value="WHATSAPP">WhatsApp Messages &amp; Groups</option>
                <option value="PHONE">Direct Phone Call</option>
                <option value="EMAIL">Formal Email Transmittals</option>
                <option value="IN_PERSON">In-Person Studio Meetings</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Key Decision Makers Involved</label>
              <input
                type="text"
                value={formData.decisionMakers}
                onChange={e => setFormData({ ...formData, decisionMakers: e.target.value })}
                placeholder="e.g. Self and spouse; father to approve civil layouts"
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Expected Start Date</label>
              <input
                type="date"
                value={formData.expectedStartDate}
                onChange={e => setFormData({ ...formData, expectedStartDate: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Target Handover / Completion</label>
              <input
                type="date"
                value={formData.expectedCompletionDate}
                onChange={e => setFormData({ ...formData, expectedCompletionDate: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION B: PROJECT TYPE SELECTION */}
      {(activeSection === 'ALL' || activeSection === 'B') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Building className="w-4 h-4 text-[#0F6CBD]" />
              <h3 className="font-bold text-slate-900 text-sm">
                B. Project Type &amp; Classification
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Select one or more matching categories
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {ALL_PROJECT_TYPES.map(type => {
              const isSelected = formData.projectTypes.includes(type);
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleToggleProjectType(type)}
                  className={`p-2 rounded border text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-blue-50 border-[#0F6CBD] text-[#0F6CBD] font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{type}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0F6CBD] shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* SECTION C: PROPERTY DETAILS */}
      {(activeSection === 'ALL' || activeSection === 'C') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Home className="w-4 h-4 text-[#0F6CBD]" />
            <h3 className="font-bold text-slate-900 text-sm">
              C. Property Dimensions, Site Attributes &amp; Restrictions
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Plot Size &amp; Dimensions</label>
              <input
                type="text"
                value={formData.plotSizeDimensions}
                onChange={e => setFormData({ ...formData, plotSizeDimensions: e.target.value })}
                placeholder="e.g. 40ft x 60ft or Tower Floor"
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Built-Up Area (sq.ft)</label>
              <input
                type="number"
                value={formData.builtUpAreaSqFt}
                onChange={e => setFormData({ ...formData, builtUpAreaSqFt: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Usable Carpet Area (sq.ft)</label>
              <input
                type="number"
                value={formData.carpetAreaSqFt}
                onChange={e => setFormData({ ...formData, carpetAreaSqFt: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none font-mono"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Scope of Construction</label>
              <select
                value={formData.constructionScope}
                onChange={e => setFormData({ ...formData, constructionScope: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none bg-white"
              >
                <option value="INTERIOR_ONLY">Interior-Only Fit-out</option>
                <option value="ARCH_INTERIOR_COMBINED">Architecture + Interior Combined</option>
                <option value="NEW_CONSTRUCTION">Construction From Scratch (EPC)</option>
                <option value="RENOVATION">Renovation &amp; Structural Remodelling</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Number of Floors</label>
              <input
                type="number"
                value={formData.numberOfFloors}
                onChange={e => setFormData({ ...formData, numberOfFloors: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Bedrooms</label>
              <input
                type="number"
                value={formData.numberOfBedrooms}
                onChange={e => setFormData({ ...formData, numberOfBedrooms: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Bathrooms</label>
              <input
                type="number"
                value={formData.numberOfBathrooms}
                onChange={e => setFormData({ ...formData, numberOfBathrooms: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Orientation / Vastu Facing</label>
              <select
                value={formData.directionFacing}
                onChange={e => setFormData({ ...formData, directionFacing: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none bg-white"
              >
                <option value="NORTH_EAST">North-East (Ishan - Auspicious)</option>
                <option value="EAST">East Facing</option>
                <option value="NORTH">North Facing</option>
                <option value="WEST">West Facing</option>
                <option value="SOUTH">South Facing</option>
                <option value="NOT_SPECIFIED">Not Vastu Specific</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs pt-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Balcony &amp; Terrace Requirements</label>
              <input
                type="text"
                value={formData.balconyTerraceRequirements}
                onChange={e => setFormData({ ...formData, balconyTerraceRequirements: e.target.value })}
                placeholder="e.g. Deck flooring with timber slats and planter boxes"
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Road Width, Approach &amp; Parking</label>
              <input
                type="text"
                value={formData.parkingRequirements}
                onChange={e => setFormData({ ...formData, parkingRequirements: e.target.value })}
                placeholder="e.g. 60ft road; 3 covered slots with EV charger"
                className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
              />
            </div>
          </div>

          <div className="text-xs">
            <label className="font-semibold text-slate-700 block mb-1">Local Authority, Society Guidelines &amp; Timing Restrictions</label>
            <textarea
              rows={2}
              value={formData.localAuthorityOrSocietyRestrictions}
              onChange={e => setFormData({ ...formData, localAuthorityOrSocietyRestrictions: e.target.value })}
              placeholder="e.g. Working hours 9 AM - 6 PM; no core cutting on weekends; service lift booking required"
              className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
            />
          </div>
        </div>
      )}

      {/* SECTION D: SPACE-WISE ROOM REQUIREMENTS & KITCHEN */}
      {(activeSection === 'ALL' || activeSection === 'D') && (
        <div className="space-y-4">
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-[#0F6CBD]" />
                <h3 className="font-bold text-slate-900 text-sm">
                  D1. Room-by-Room Functional Requirements ({formData.roomRequirements.length} Areas)
                </h3>
              </div>
              <button
                type="button"
                onClick={handleAddRoom}
                className="flex items-center gap-1 text-xs font-bold text-[#0F6CBD] hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Room / Area</span>
              </button>
            </div>

            <div className="space-y-4">
              {formData.roomRequirements.map((room, idx) => (
                <div key={room.id} className="p-4 rounded-lg border border-slate-200 bg-slate-50/50 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 rounded-full bg-[#0F6CBD] text-white text-[10px] font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <input
                        type="text"
                        value={room.areaName}
                        onChange={e => handleUpdateRoom(room.id, 'areaName', e.target.value)}
                        className="font-bold text-slate-900 text-xs px-2 py-1 bg-white border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={room.dimensions}
                        onChange={e => handleUpdateRoom(room.id, 'dimensions', e.target.value)}
                        placeholder="Dimensions (e.g. 24ft x 18ft)"
                        className="text-xs text-slate-600 px-2 py-1 bg-white border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none font-mono"
                      />
                    </div>

                    <div className="flex items-center gap-2">
                      <select
                        value={room.budgetPriority}
                        onChange={e => handleUpdateRoom(room.id, 'budgetPriority', e.target.value)}
                        className="text-[11px] font-semibold border border-slate-300 rounded px-2 py-0.5 bg-white"
                      >
                        <option value="HIGH">High Priority Area</option>
                        <option value="MEDIUM">Medium Priority</option>
                        <option value="LOW">Low Priority</option>
                      </select>
                      {formData.roomRequirements.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveRoom(room.id)}
                          className="text-slate-400 hover:text-red-600 p-1"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block uppercase">Required Furniture</label>
                      <input
                        type="text"
                        value={room.requiredFurniture}
                        onChange={e => handleUpdateRoom(room.id, 'requiredFurniture', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block uppercase">Storage Needs</label>
                      <input
                        type="text"
                        value={room.storageRequirements}
                        onChange={e => handleUpdateRoom(room.id, 'storageRequirements', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block uppercase">Lighting &amp; Ambience</label>
                      <input
                        type="text"
                        value={room.lightingRequirements}
                        onChange={e => handleUpdateRoom(room.id, 'lightingRequirements', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold text-slate-500 block uppercase">Preferred Finishes</label>
                      <input
                        type="text"
                        value={room.preferredMaterials}
                        onChange={e => handleUpdateRoom(room.id, 'preferredMaterials', e.target.value)}
                        className="w-full px-2 py-1 border border-slate-300 rounded bg-white"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* D2. Gourmet Kitchen Specific Requirements */}
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
              <Utensils className="w-4 h-4 text-[#0F6CBD]" />
              <h3 className="font-bold text-slate-900 text-sm">
                D2. Kitchen Engineering &amp; Appliance Requirements
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Layout Configuration</label>
                <select
                  value={formData.kitchenDetails.layoutType}
                  onChange={e => setFormData({
                    ...formData,
                    kitchenDetails: { ...formData.kitchenDetails, layoutType: e.target.value as any }
                  })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="ISLAND">Island Kitchen (Center Gourmet Island)</option>
                  <option value="PARALLEL">Parallel Kitchen (Two Opposite Counters)</option>
                  <option value="L_SHAPED">L-Shaped Kitchen</option>
                  <option value="U_SHAPED">U-Shaped Kitchen (Maximum Countertop)</option>
                  <option value="STRAIGHT">Straight Single-Wall Counter</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Construction Methodology</label>
                <select
                  value={formData.kitchenDetails.constructionType}
                  onChange={e => setFormData({
                    ...formData,
                    kitchenDetails: { ...formData.kitchenDetails, constructionType: e.target.value as any }
                  })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
                >
                  <option value="MODULAR">Factory Precision Modular Carcass</option>
                  <option value="CIVIL_SEMI_MODULAR">Civil Granite Base + Modular Shutters</option>
                  <option value="FULL_BESPOKE">Full Bespoke Handcrafted Joinery</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Countertop Material</label>
                <input
                  type="text"
                  value={formData.kitchenDetails.countertopMaterial}
                  onChange={e => setFormData({
                    ...formData,
                    kitchenDetails: { ...formData.kitchenDetails, countertopMaterial: e.target.value }
                  })}
                  placeholder="e.g. Dekton 15mm Porcelain Slab"
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Chimney &amp; Hob Specification</label>
                <input
                  type="text"
                  value={formData.kitchenDetails.chimneyAndHob}
                  onChange={e => setFormData({
                    ...formData,
                    kitchenDetails: { ...formData.kitchenDetails, chimneyAndHob: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Refrigerator Specification</label>
                <input
                  type="text"
                  value={formData.kitchenDetails.refrigeratorSize}
                  onChange={e => setFormData({
                    ...formData,
                    kitchenDetails: { ...formData.kitchenDetails, refrigeratorSize: e.target.value }
                  })}
                  className="w-full px-3 py-1.5 border border-slate-300 rounded"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kitchenDetails.tallUnitRequired}
                    onChange={e => setFormData({
                      ...formData,
                      kitchenDetails: { ...formData.kitchenDetails, tallUnitRequired: e.target.checked }
                    })}
                    className="rounded text-[#0F6CBD]"
                  />
                  <span className="font-semibold text-slate-700">Tall Pantry Unit</span>
                </label>

                <label className="flex items-center gap-1.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.kitchenDetails.dishwasher}
                    onChange={e => setFormData({
                      ...formData,
                      kitchenDetails: { ...formData.kitchenDetails, dishwasher: e.target.checked }
                    })}
                    className="rounded text-[#0F6CBD]"
                  />
                  <span className="font-semibold text-slate-700">Built-in Dishwasher</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SECTION E: LIFESTYLE, VASTU & ACCESSIBILITY */}
      {(activeSection === 'ALL' || activeSection === 'E') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Compass className="w-4 h-4 text-[#0F6CBD]" />
            <h3 className="font-bold text-slate-900 text-sm">
              E. Lifestyle, Family Needs, Vastu &amp; Functional Requirements
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Family Members Count</label>
              <input
                type="number"
                value={formData.familyMembersCount}
                onChange={e => setFormData({ ...formData, familyMembersCount: Number(e.target.value) })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Vastu Compliance Priority</label>
              <select
                value={formData.vastuPreference}
                onChange={e => setFormData({ ...formData, vastuPreference: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
              >
                <option value="STRICT">Strict Vastu (Mandatory Pooja, Kitchen SE, Master SW)</option>
                <option value="MODERATE">Moderate Vastu (Flexible within layout)</option>
                <option value="NOT_IMPORTANT">Not Vastu Specific</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Children / Elderly Requirements</label>
              <input
                type="text"
                value={formData.hasChildrenOrElderly}
                onChange={e => setFormData({ ...formData, hasChildrenOrElderly: e.target.value })}
                placeholder="e.g. Step-free shower, round edge furniture"
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs pt-1">
            <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.smartHomeRequirements !== ''}
                onChange={e => setFormData({
                  ...formData,
                  smartHomeRequirements: e.target.checked ? 'Lutron / KNX full lighting & curtain automation' : ''
                })}
                className="rounded text-[#0F6CBD]"
              />
              <span className="font-semibold text-slate-700">Smart Automation</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.securityCctv}
                onChange={e => setFormData({ ...formData, securityCctv: e.target.checked })}
                className="rounded text-[#0F6CBD]"
              />
              <span className="font-semibold text-slate-700">CCTV &amp; Biometrics</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.homeTheatre}
                onChange={e => setFormData({ ...formData, homeTheatre: e.target.checked })}
                className="rounded text-[#0F6CBD]"
              />
              <span className="font-semibold text-slate-700">Home Theatre Room</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.prayerPoojaRoom}
                onChange={e => setFormData({ ...formData, prayerPoojaRoom: e.target.checked })}
                className="rounded text-[#0F6CBD]"
              />
              <span className="font-semibold text-slate-700">Dedicated Pooja Mandir</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.servantRoom}
                onChange={e => setFormData({ ...formData, servantRoom: e.target.checked })}
                className="rounded text-[#0F6CBD]"
              />
              <span className="font-semibold text-slate-700">Servant Room &amp; Bath</span>
            </label>

            <label className="flex items-center gap-2 p-2 rounded border border-slate-200 bg-slate-50 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.utilityLaundryArea}
                onChange={e => setFormData({ ...formData, utilityLaundryArea: e.target.checked })}
                className="rounded text-[#0F6CBD]"
              />
              <span className="font-semibold text-slate-700">Utility / Laundry Area</span>
            </label>
          </div>
        </div>
      )}

      {/* SECTION F: STYLE PREFERENCES & FINISHES */}
      {(activeSection === 'ALL' || activeSection === 'F') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Palette className="w-4 h-4 text-[#0F6CBD]" />
              <h3 className="font-bold text-slate-900 text-sm">
                F. Architectural Styles &amp; Finish Preferences
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              Select one or more aesthetic themes for AI to synthesize
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            {ALL_STYLE_OPTIONS.map(st => {
              const isSelected = formData.selectedStyles.includes(st);
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => handleToggleStyle(st)}
                  className={`p-2 rounded border text-left flex items-center justify-between transition ${
                    isSelected
                      ? 'bg-purple-50 border-purple-600 text-purple-700 font-bold shadow-2xs'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <span className="truncate">{st}</span>
                  {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-purple-600 shrink-0 ml-1" />}
                </button>
              );
            })}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs pt-2">
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Preferred Flooring Type</label>
              <input
                type="text"
                value={formData.preferredFlooring}
                onChange={e => setFormData({ ...formData, preferredFlooring: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Wood Finish Preference</label>
              <input
                type="text"
                value={formData.woodFinishPreference}
                onChange={e => setFormData({ ...formData, woodFinishPreference: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Metal Finish Preference</label>
              <input
                type="text"
                value={formData.metalFinishPreference}
                onChange={e => setFormData({ ...formData, metalFinishPreference: e.target.value })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Surface Sheen</label>
              <select
                value={formData.glossOrMatte}
                onChange={e => setFormData({ ...formData, glossOrMatte: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
              >
                <option value="MATTE">Deep Velvet Matte (Contemporary)</option>
                <option value="SATIN_SEMI_GLOSS">Satin / Semi-Gloss (Durable)</option>
                <option value="GLOSSY">High Gloss / Mirror Polish (Reflective)</option>
                <option value="TEXTURED">Tactile Stone / Raw Textured</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Spatial Feel</label>
              <select
                value={formData.openOrClosedSpaces}
                onChange={e => setFormData({ ...formData, openOrClosedSpaces: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
              >
                <option value="OPEN_CONCEPT">Open-Plan Continuous Flow</option>
                <option value="CLOSED_COMPARTMENTALIZED">Defined Compartmentalized Rooms</option>
                <option value="HYBRID_FLEXIBLE">Hybrid Flexible Sliding Dividers</option>
              </select>
            </div>
            <div>
              <label className="font-semibold text-slate-700 block mb-1">Lighting Atmosphere</label>
              <select
                value={formData.lightingInteriorAtmosphere}
                onChange={e => setFormData({ ...formData, lightingInteriorAtmosphere: e.target.value as any })}
                className="w-full px-3 py-1.5 border border-slate-300 rounded bg-white"
              >
                <option value="WARM_MOODY">Warm &amp; Moody (2700K - 3000K)</option>
                <option value="LIGHT_AIRY">Bright, Light &amp; Airy (3500K - 4000K)</option>
                <option value="NEUTRAL_BALANCED">Neutral Balanced Gallery Atmosphere</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* SECTION G: BUDGET & COMMERCIAL DETAILS */}
      {(activeSection === 'ALL' || activeSection === 'G') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              G. Budget, Commercial Details &amp; Cost Category Breakdown
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Overall Budget Tier</span>
              <select
                value={formData.budgetTier}
                onChange={e => setFormData({ ...formData, budgetTier: e.target.value as any })}
                className="mt-1 w-full text-xs font-bold text-[#0F6CBD] bg-white border border-slate-300 rounded px-2 py-1"
              >
                <option value="BASIC">Basic (₹1,500 - ₹2,200/sq.ft)</option>
                <option value="STANDARD">Standard (₹2,200 - ₹3,500/sq.ft)</option>
                <option value="PREMIUM">Premium (₹3,500 - ₹5,000/sq.ft)</option>
                <option value="LUXURY">Ultra Luxury (₹5,000+/sq.ft)</option>
              </select>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Total Project Budget (INR)</span>
              <input
                type="number"
                value={formData.overallBudgetINR}
                onChange={e => setFormData({ ...formData, overallBudgetINR: Number(e.target.value) })}
                className="mt-1 w-full text-sm font-bold font-mono text-emerald-700 bg-white border border-slate-300 rounded px-2 py-1"
              />
              <span className="text-[10px] text-slate-400">₹{(formData.overallBudgetINR / 100000).toFixed(1)} Lakhs</span>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50">
              <span className="text-[10px] font-bold text-slate-500 uppercase block">Budget Flexibility</span>
              <select
                value={formData.budgetFlexibility}
                onChange={e => setFormData({ ...formData, budgetFlexibility: e.target.value as any })}
                className="mt-1 w-full text-xs bg-white border border-slate-300 rounded px-2 py-1"
              >
                <option value="STRICT_CAP">Strict Cap (No Overruns)</option>
                <option value="MODERATE_10_PERCENT">Moderate (+/- 10% for Quality)</option>
                <option value="FLEXIBLE_FOR_QUALITY">Flexible for Premium Specifications</option>
              </select>
            </div>

            <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase block">GST Status</span>
                <span className="text-xs font-semibold text-slate-800">
                  {formData.isGstIncluded ? 'Inclusive of 18% GST' : 'Exclusive (+ 18% GST)'}
                </span>
              </div>
              <input
                type="checkbox"
                checked={formData.isGstIncluded}
                onChange={e => setFormData({ ...formData, isGstIncluded: e.target.checked })}
                className="rounded text-[#0F6CBD]"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-6 gap-3 text-xs pt-1">
            <div>
              <label className="text-[10px] font-bold text-slate-500 block">Interior Budget</label>
              <input
                type="number"
                value={formData.interiorBudgetINR}
                onChange={e => setFormData({ ...formData, interiorBudgetINR: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block">Civil Budget</label>
              <input
                type="number"
                value={formData.civilBudgetINR}
                onChange={e => setFormData({ ...formData, civilBudgetINR: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block">Modular Kitchen</label>
              <input
                type="number"
                value={formData.kitchenWardrobeBudgetINR}
                onChange={e => setFormData({ ...formData, kitchenWardrobeBudgetINR: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block">Loose Furniture</label>
              <input
                type="number"
                value={formData.furnitureBudgetINR}
                onChange={e => setFormData({ ...formData, furnitureBudgetINR: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block">MEP Automation</label>
              <input
                type="number"
                value={formData.mepBudgetINR}
                onChange={e => setFormData({ ...formData, mepBudgetINR: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-xs"
              />
            </div>
            <div>
              <label className="text-[10px] font-bold text-slate-500 block">Architecture Fee</label>
              <input
                type="number"
                value={formData.architectureBudgetINR}
                onChange={e => setFormData({ ...formData, architectureBudgetINR: Number(e.target.value) })}
                className="w-full px-2 py-1 border border-slate-300 rounded font-mono text-xs"
              />
            </div>
          </div>
        </div>
      )}

      {/* SECTION H: APPROVALS, DOCUMENTS & PINTEREST / DESIGN REFERENCES */}
      {(activeSection === 'ALL' || activeSection === 'H') && (
        <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-5 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileCheck className="w-4 h-4 text-[#0F6CBD]" />
            <h3 className="font-bold text-slate-900 text-sm">
              H. Approvals, Statutory Documents &amp; Customer Pinterest / Design References
            </h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
            <div className="space-y-2">
              <label className="font-semibold text-slate-700 block">Customer Reference Links (Pinterest / Instagram / Drive)</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={formData.clientPinterestInstagramLinks}
                  onChange={e => setFormData({ ...formData, clientPinterestInstagramLinks: e.target.value })}
                  placeholder="https://pinterest.com/board-link..."
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded font-sans text-xs focus:border-[#0F6CBD] focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    if (formData.clientPinterestInstagramLinks.startsWith('http')) {
                      window.open(formData.clientPinterestInstagramLinks, '_blank');
                    }
                  }}
                  className="px-2.5 py-1.5 rounded border border-slate-300 hover:bg-slate-50 text-slate-600"
                  title="Open Reference Board"
                >
                  <ExternalLink className="w-4 h-4" />
                </button>
              </div>

              <span className="text-[11px] text-slate-500 block italic">
                Rule of Thumb: Request 5–10 images that represent preferred style, and 3–5 images the customer strictly dislikes.
              </span>

              <div className="pt-2">
                <label className="font-semibold text-slate-700 block mb-1">Disliked Styles, Colours or Elements to Avoid</label>
                <textarea
                  rows={2}
                  value={formData.dislikedDesignsNotes}
                  onChange={e => setFormData({ ...formData, dislikedDesignsNotes: e.target.value })}
                  placeholder="e.g. Strictly avoid glossy laminate finishes, yellow ambient lighting, or heavy false ceilings..."
                  className="w-full px-3 py-1.5 border border-slate-300 rounded focus:border-[#0F6CBD] focus:outline-none text-xs"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="font-semibold text-slate-700 block">Available Statutory &amp; Technical Documents</label>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {[
                  'Sale Deed or Ownership Proof',
                  'Approved Building Sanction Plan',
                  'Existing As-Built Floor Plan CAD',
                  'Structural RCC Drawings & Grid',
                  'Soil Test Geotechnical Report',
                  'Existing Electrical Single Line Diagram',
                  'Plumbing & Sewage Connection Layout',
                  'Society Interior Fit-out Guidelines & NOC',
                  'Municipal Corporation Permission',
                  'Fire Safety Clearance (Commercial Projects)'
                ].map(docName => {
                  const isChecked = formData.documentsAvailable.includes(docName);
                  return (
                    <label key={docName} className="flex items-center gap-2 p-1.5 rounded hover:bg-slate-50 text-slate-700 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={isChecked}
                        onChange={() => {
                          setFormData(prev => ({
                            ...prev,
                            documentsAvailable: isChecked
                              ? prev.documentsAvailable.filter(d => d !== docName)
                              : [...prev.documentsAvailable, docName]
                          }));
                        }}
                        className="rounded text-[#0F6CBD]"
                      />
                      <span className="truncate">{docName}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Action Footer */}
      <div className="bg-white rounded-lg border border-slate-200 p-4 shadow-sm flex items-center justify-between">
        <div className="text-xs text-slate-500">
          Last synchronized with Project: <strong className="text-slate-800">{project.projectCode}</strong> ({project.title})
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleSave}
            className="px-4 py-2 rounded bg-white text-slate-700 border border-slate-300 hover:bg-slate-50 text-xs font-bold transition shadow-xs"
          >
            Save Discovery Form
          </button>
          <button
            type="button"
            onClick={() => {
              handleSave();
              onGenerateAIOptions();
            }}
            className="px-4 py-2 rounded bg-[#0F6CBD] text-white hover:bg-[#0F6CBD]/90 text-xs font-bold transition flex items-center gap-1.5 shadow-xs"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>Generate AI Sample Images &amp; 4–5 Concepts</span>
          </button>
        </div>
      </div>
    </div>
  );
};
