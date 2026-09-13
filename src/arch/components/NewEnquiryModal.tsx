import React, { useState } from 'react';
import {
  X,
  Building,
  User,
  Mail,
  Phone,
  MapPin,
  Maximize2,
  DollarSign,
  Calendar,
  Sparkles,
  Layers,
  ArrowRight
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { EngagementType, BudgetTier } from '../types';

interface NewEnquiryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newProjectId: string) => void;
}

const ENGAGEMENT_TYPES: EngagementType[] = [
  'Complete design-and-build',
  'Interior turnkey',
  'Interior design consultancy',
  'Architecture consultancy',
  'Construction execution',
  'Renovation',
  'Landscape',
  'Modular furniture'
];

const BUDGET_TIERS: BudgetTier[] = [
  'Value / Affordable',
  'Standard Premium',
  'High-End Luxury',
  'Ultra Luxury Bespoke'
];

export const NewEnquiryModal: React.FC<NewEnquiryModalProps> = ({
  isOpen,
  onClose,
  onSuccess
}) => {
  const { createEnquiry } = useProject();

  const [clientName, setClientName] = useState('');
  const [organizationOrFamily, setOrganizationOrFamily] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [siteAddress, setSiteAddress] = useState('');
  const [siteCity, setSiteCity] = useState('Mumbai');
  const [builtUpAreaSqFt, setBuiltUpAreaSqFt] = useState<number>(3200);
  const [siteAreaSqFt, setSiteAreaSqFt] = useState<number>(3600);
  const [engagementType, setEngagementType] = useState<EngagementType>('Complete design-and-build');
  const [budgetTier, setBudgetTier] = useState<BudgetTier>('High-End Luxury');
  const [targetBudget, setTargetBudget] = useState<number>(11000000);
  const [targetTimelineMonths, setTargetTimelineMonths] = useState<number>(5);
  const [projectVision, setProjectVision] = useState('');
  const [roomZonesText, setRoomZonesText] = useState('Living & Dining Great Room\nMaster Suite\nGuest Bedroom\nGourmet Kitchen\nStudy');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName.trim()) return;

    const roomZones = roomZonesText
      .split('\n')
      .map(z => z.trim())
      .filter(Boolean);

    const newProject = createEnquiry({
      clientName: clientName.trim(),
      organizationOrFamily: organizationOrFamily.trim() || `${clientName.trim()} Residence`,
      contactEmail: contactEmail.trim(),
      contactPhone: contactPhone.trim(),
      siteAddress: siteAddress.trim(),
      siteCity: siteCity.trim() || 'Mumbai',
      builtUpAreaSqFt: Number(builtUpAreaSqFt) || 3000,
      siteAreaSqFt: Number(siteAreaSqFt) || 3500,
      engagementType,
      budgetTier,
      targetBudget: Number(targetBudget) || 10000000,
      targetTimelineMonths: Number(targetTimelineMonths) || 6,
      confirmedRequirements: {
        projectVision: projectVision.trim() || 'Full architectural design and turnkey fit-out.',
        roomZones: roomZones.length > 0 ? roomZones : ['Living Room', 'Master Bedroom', 'Kitchen'],
        stylePreferences: ['Contemporary Minimalist'],
        specialConstraints: 'None specified at intake.',
        dateConfirmed: new Date().toISOString().slice(0, 10)
      }
    });

    if (newProject && newProject.id) {
      onSuccess(newProject.id);
      onClose();
    }
  };

  return (
    <div 
      role="dialog" 
      aria-modal="true" 
      aria-label="New Client Architectural Enquiry"
      className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto"
    >
      <div className="bg-white rounded-2xl max-w-3xl w-full border border-slate-200 shadow-2xl overflow-hidden my-6">
        {/* Header */}
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center border border-indigo-100">
              <Building className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                New Client Architectural Enquiry Intake
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Capture discovery details, spatial scope, budget tier, and launch the architectural pipeline.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Section 1: Customer Contact */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <User className="w-3.5 h-3.5 text-indigo-600" />
              <span>Customer Identification & Contacts</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Client Primary Contact Name *
                </label>
                <input
                  type="text"
                  required
                  value={clientName}
                  onChange={e => setClientName(e.target.value)}
                  placeholder="e.g. Vikram & Priya Malhotra"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Family / Organization Name
                </label>
                <input
                  type="text"
                  value={organizationOrFamily}
                  onChange={e => setOrganizationOrFamily(e.target.value)}
                  placeholder="e.g. Malhotra Family Residence"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Email
                </label>
                <input
                  type="email"
                  value={contactEmail}
                  onChange={e => setContactEmail(e.target.value)}
                  placeholder="client@domain.com"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Contact Phone
                </label>
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={e => setContactPhone(e.target.value)}
                  placeholder="+91 98200 00000"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>
            </div>
          </div>

          {/* Section 2: Property & Scope */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-indigo-600" />
              <span>Site Location & Spatial Metrics</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Site / Property Address
                </label>
                <input
                  type="text"
                  value={siteAddress}
                  onChange={e => setSiteAddress(e.target.value)}
                  placeholder="e.g. Flat 1402, Skyline Heights, Worli"
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Site City
                </label>
                <input
                  type="text"
                  value={siteCity}
                  onChange={e => setSiteCity(e.target.value)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Built-Up Area (sq.ft)
                </label>
                <input
                  type="number"
                  value={builtUpAreaSqFt}
                  onChange={e => setBuiltUpAreaSqFt(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Engagement & Commercials */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <DollarSign className="w-3.5 h-3.5 text-indigo-600" />
              <span>Engagement Route & Commercial Envelope</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Engagement Typology
                </label>
                <select
                  value={engagementType}
                  onChange={e => setEngagementType(e.target.value as EngagementType)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  {ENGAGEMENT_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Specification & Budget Tier
                </label>
                <select
                  value={budgetTier}
                  onChange={e => setBudgetTier(e.target.value as BudgetTier)}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                >
                  {BUDGET_TIERS.map(tier => (
                    <option key={tier} value={tier}>{tier}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Budget (₹ INR)
                </label>
                <input
                  type="number"
                  value={targetBudget}
                  onChange={e => setTargetBudget(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Target Timeline (Months)
                </label>
                <input
                  type="number"
                  value={targetTimelineMonths}
                  onChange={e => setTargetTimelineMonths(Number(e.target.value))}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Section 4: Brief & Vision */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3 flex items-center space-x-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
              <span>Project Vision & Program</span>
            </h4>
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Project Vision & Lifestyle Intent
                </label>
                <textarea
                  value={projectVision}
                  onChange={e => setProjectVision(e.target.value)}
                  rows={2}
                  placeholder="Summarize client lifestyle, aesthetic goals, family requirements..."
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Key Room Zones (one per line)
                </label>
                <textarea
                  value={roomZonesText}
                  onChange={e => setRoomZonesText(e.target.value)}
                  rows={3}
                  className="w-full text-xs p-2.5 bg-white border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-600 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 text-xs font-semibold rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-xs flex items-center space-x-2"
            >
              <span>Create Enquiry & Launch Workspace</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
