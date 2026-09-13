import React, { useState } from 'react';
import {
  Briefcase,
  Search,
  Plus,
  ArrowRight,
  CheckCircle2,
  Clock,
  Building,
  User,
  MapPin,
  TrendingUp,
  FileSpreadsheet,
  Layers,
  ChevronDown
} from 'lucide-react';
import { ProjectRecord, UserSession } from '../types/erp';

interface ProjectsRegisterViewProps {
  projects: ProjectRecord[];
  activeProjectId: string;
  currentUser: UserSession;
  onSelectProject: (projectId: string) => void;
  onCreateProject: (project: Partial<ProjectRecord>) => void;
  onOpenJobCard: (projectId: string) => void;
}

export const ProjectsRegisterView: React.FC<ProjectsRegisterViewProps> = ({
  projects,
  activeProjectId,
  currentUser,
  onSelectProject,
  onCreateProject,
  onOpenJobCard
}) => {
  const [search, setSearch] = useState('');
  const [selectedStage, setSelectedStage] = useState<string>('ALL');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New Project Form State
  const [newProject, setNewProject] = useState<Partial<ProjectRecord>>({
    title: '',
    clientName: '',
    clientPhone: '',
    clientEmail: '',
    carpetAreaSqFt: 1500,
    estimatedBudget: 3500000,
    siteAddress: '',
    city: 'NCR (Gurugram)'
  });

  const filtered = projects.filter(p => {
    const matchesSearch =
      p.projectCode.toLowerCase().includes(search.toLowerCase()) ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.clientName.toLowerCase().includes(search.toLowerCase()) ||
      p.city.toLowerCase().includes(search.toLowerCase());

    const matchesStage = selectedStage === 'ALL' || p.stage === selectedStage;
    return matchesSearch && matchesStage;
  });

  const totalValue = projects.reduce((acc, p) => acc + (p.estimatedBudget || 0), 0);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProject.title || !newProject.clientName) return;

    onCreateProject({
      ...newProject,
      id: `PROJ-${Date.now()}`,
      projectCode: `BS-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      stage: 'REQUIREMENTS_SURVEY',
      revisions: []
    });

    setShowCreateModal(false);
    setNewProject({
      title: '',
      clientName: '',
      clientPhone: '',
      clientEmail: '',
      carpetAreaSqFt: 1500,
      estimatedBudget: 3500000,
      siteAddress: '',
      city: 'NCR (Gurugram)'
    });
  };

  return (
    <div className="space-y-4">
      {/* 1. DIRECTORY HEADER & SUMMARY */}
      <div className="bg-white rounded-lg border border-[#E1DFDD] p-4 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-[#0F6CBD] uppercase tracking-wider">
              Dynamics 365 Business Central • Page 89
            </span>
            <span className="bg-[#EFF6FC] text-[#0F6CBD] text-[10px] px-2 py-0.5 rounded font-bold border border-[#C7E0F4]">
              Jobs (Projects) Master Register
            </span>
          </div>
          <h1 className="text-lg font-bold text-[#201F1E] mt-0.5">
            Turnkey Interior Jobs &amp; Project Register
          </h1>
          <p className="text-xs text-[#605E5C] mt-0.5">
            Active customer contracts, site surveys, commercial BOQs, and project costing registers.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-3.5 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold flex items-center gap-1.5 shadow-xs transition"
        >
          <Plus className="h-3.5 w-3.5" />
          <span>New Job Card (+)</span>
        </button>
      </div>

      {/* 2. CUE TILES */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="bg-white p-3 rounded-lg border border-[#E1DFDD] shadow-xs">
          <div className="text-[11px] text-[#605E5C] font-semibold">Total Active Jobs</div>
          <div className="font-mono text-xl font-bold text-[#201F1E] mt-1">
            {projects.length} Projects
          </div>
          <div className="text-[10px] text-[#107C41] mt-0.5">All tracked in D365</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E1DFDD] shadow-xs">
          <div className="text-[11px] text-[#605E5C] font-semibold">Total Contract Pipeline</div>
          <div className="font-mono text-xl font-bold text-[#0F6CBD] mt-1">
            ₹{(totalValue / 10000000).toFixed(2)} Cr
          </div>
          <div className="text-[10px] text-[#605E5C] mt-0.5">Excl. 18% GST</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E1DFDD] shadow-xs">
          <div className="text-[11px] text-[#605E5C] font-semibold">Execution &amp; Takeoff</div>
          <div className="font-mono text-xl font-bold text-[#107C41] mt-1">
            {projects.filter(p => p.stage === 'EXECUTION_ONGOING' || p.stage === 'APPROVED_BUDGET').length} Projects
          </div>
          <div className="text-[10px] text-[#107C41] mt-0.5">Frozen baseline</div>
        </div>

        <div className="bg-white p-3 rounded-lg border border-[#E1DFDD] shadow-xs">
          <div className="text-[11px] text-[#605E5C] font-semibold">Surveys in Progress</div>
          <div className="font-mono text-xl font-bold text-[#B87A38] mt-1">
            {projects.filter(p => p.stage === 'REQUIREMENTS_SURVEY' || p.stage === 'AI_DRAFT_BOQ').length} Projects
          </div>
          <div className="text-[10px] text-[#605E5C] mt-0.5">Dimensional capture</div>
        </div>
      </div>

      {/* 3. FILTER & SEARCH BAR */}
      <div className="bg-white rounded-lg border border-[#E1DFDD] p-3 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-[#FAF9F8] px-2.5 py-1.5 rounded border border-[#EDEBE9]">
          <Search className="h-4 w-4 text-[#8A8886]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by job code, project name, customer, city..."
            className="w-full bg-transparent border-none outline-none text-xs text-[#201F1E]"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#605E5C] font-semibold">Stage Filter:</span>
          <select
            value={selectedStage}
            onChange={e => setSelectedStage(e.target.value)}
            className="px-2.5 py-1.5 rounded border border-[#8A8886] bg-white text-xs text-[#323130] focus:border-[#0F6CBD]"
          >
            <option value="ALL">All Stages ({projects.length})</option>
            <option value="ENQUIRY">Enquiry &amp; CRM</option>
            <option value="REQUIREMENTS_SURVEY">Requirements &amp; Survey</option>
            <option value="AI_DRAFT_BOQ">AI Draft BOQ</option>
            <option value="ESTIMATOR_REVIEW">Estimator Review</option>
            <option value="APPROVED_BUDGET">Approved Baseline</option>
            <option value="CUSTOMER_QUOTATION">Customer Quotation</option>
            <option value="EXECUTION_ONGOING">Site Execution</option>
          </select>
        </div>
      </div>

      {/* 4. TABLE VIEW */}
      <div className="bg-white rounded-lg border border-[#E1DFDD] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#F3F2F1] text-[#605E5C] border-b border-[#EDEBE9]">
                <th className="py-2.5 px-3 font-semibold w-28">Job No.</th>
                <th className="py-2.5 px-3 font-semibold">Project Title &amp; Scope</th>
                <th className="py-2.5 px-3 font-semibold">Customer</th>
                <th className="py-2.5 px-3 font-semibold">City</th>
                <th className="py-2.5 px-3 font-semibold text-right">Carpet Area</th>
                <th className="py-2.5 px-3 font-semibold text-right">Contract Value</th>
                <th className="py-2.5 px-3 font-semibold">Lifecycle Stage</th>
                <th className="py-2.5 px-3 font-semibold text-center">Status</th>
                <th className="py-2.5 px-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EDEBE9]">
              {filtered.map(proj => {
                const isActive = proj.id === activeProjectId;
                return (
                  <tr
                    key={proj.id}
                    className={`transition hover:bg-[#FAF9F8] ${
                      isActive ? 'bg-[#EFF6FC]/50 font-medium' : ''
                    }`}
                  >
                    <td className="py-2.5 px-3 font-mono font-bold text-[#0F6CBD]">
                      {proj.projectCode}
                      {isActive && (
                        <span className="block text-[9px] text-[#107C41] font-bold">● Active</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3">
                      <div className="font-semibold text-[#201F1E]">{proj.title}</div>
                      <div className="text-[11px] text-[#605E5C] truncate max-w-[280px]">
                        {proj.siteAddress || 'DLF Phase 5, Gurugram'}
                      </div>
                    </td>
                    <td className="py-2.5 px-3 text-[#201F1E]">
                      <div className="font-semibold">{proj.clientName}</div>
                      <div className="text-[10px] text-[#605E5C]">{proj.clientPhone}</div>
                    </td>
                    <td className="py-2.5 px-3 text-[#605E5C]">{proj.city || 'Gurugram'}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-[#201F1E]">
                      {(proj.carpetAreaSqFt || 1650).toLocaleString()} sq.ft
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-bold text-[#0F6CBD]">
                      ₹{(proj.estimatedBudget || 4350000).toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3">
                      <span className="bg-[#F3F2F1] text-[#323130] text-[10px] px-2 py-0.5 rounded font-medium">
                        {proj.stage.replace(/_/g, ' ')}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-center">
                      <span className="bg-[#DFF6DD] text-[#107C41] text-[10px] px-2 py-0.5 rounded font-bold border border-[#B3E5C7]">
                        Open
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => onOpenJobCard(proj.id)}
                        className="px-3 py-1 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold flex items-center gap-1 ml-auto shadow-xs"
                      >
                        <span>Open Job Card</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. MODAL: CREATE JOB CARD */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg border border-[#E1DFDD] shadow-2xl max-w-lg w-full p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-[#EDEBE9] pb-2">
              <h3 className="font-bold text-sm text-[#201F1E] flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-[#0F6CBD]" />
                Create New Turnkey Interior Job Card
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-[#605E5C] hover:text-[#201F1E] font-bold text-base"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-[#323130] mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={newProject.title}
                  onChange={e => setNewProject({ ...newProject, title: e.target.value })}
                  placeholder="e.g., 4BHK Turnkey Renovation - The Magnolias"
                  className="w-full px-3 py-1.5 rounded border border-[#8A8886] focus:border-[#0F6CBD]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#323130] mb-1">Client Name *</label>
                  <input
                    type="text"
                    required
                    value={newProject.clientName}
                    onChange={e => setNewProject({ ...newProject, clientName: e.target.value })}
                    placeholder="e.g., Rajiv &amp; Meenakshi Singhal"
                    className="w-full px-3 py-1.5 rounded border border-[#8A8886]"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#323130] mb-1">Client Phone *</label>
                  <input
                    type="text"
                    required
                    value={newProject.clientPhone}
                    onChange={e => setNewProject({ ...newProject, clientPhone: e.target.value })}
                    placeholder="+91 98100 XXXXX"
                    className="w-full px-3 py-1.5 rounded border border-[#8A8886]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-[#323130] mb-1">Carpet Area (sq.ft) *</label>
                  <input
                    type="number"
                    required
                    value={newProject.carpetAreaSqFt}
                    onChange={e => setNewProject({ ...newProject, carpetAreaSqFt: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded border border-[#8A8886] font-mono text-right"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-[#323130] mb-1">Target Budget (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newProject.estimatedBudget}
                    onChange={e => setNewProject({ ...newProject, estimatedBudget: Number(e.target.value) })}
                    className="w-full px-3 py-1.5 rounded border border-[#8A8886] font-mono text-right"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-[#323130] mb-1">Site Address</label>
                <input
                  type="text"
                  value={newProject.siteAddress}
                  onChange={e => setNewProject({ ...newProject, siteAddress: e.target.value })}
                  placeholder="e.g., Unit 802, Tower 4, Sector 54, Gurugram"
                  className="w-full px-3 py-1.5 rounded border border-[#8A8886]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-[#EDEBE9]">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-3 py-1.5 rounded bg-white text-[#323130] border border-[#8A8886] hover:bg-[#F3F2F1] text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-3.5 py-1.5 rounded bg-[#0F6CBD] text-white hover:bg-[#0B5A9E] text-xs font-semibold"
                >
                  Create Job Card
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
