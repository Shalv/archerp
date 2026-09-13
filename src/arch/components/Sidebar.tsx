import React from 'react';
import {
  Compass,
  Users,
  FileText,
  Sparkles,
  Calculator,
  HardHat,
  Receipt,
  Database,
  Plus,
  RotateCcw,
  CheckCircle2,
  Menu,
  X,
  SlidersHorizontal,
  Layers,
  ArrowRight,
  User,
  LogOut,
  Lock,
  Eye,
  ShieldCheck,
  BrainCircuit,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';
import { useAuth } from '../context/AuthContext';
import { AppModuleId } from '../types';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenNewEnquiry: () => void;
  onOpenBackupModal: () => void;
  onOpenProfileModal: (tab?: 'details' | 'security' | 'permissions') => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  onOpenNewEnquiry,
  onOpenBackupModal,
  onOpenProfileModal,
  isMobileOpen,
  setIsMobileOpen,
}) => {
  const {
    projects,
    activeProject,
    resetToDefaultSeed,
    masterData,
  } = useProject();

  const { user, logout, getModulePermission } = useAuth();

  const totalMastersCount =
    masterData.trades.length +
    masterData.materials.length +
    masterData.zones.length +
    masterData.vendors.length +
    masterData.milestones.length +
    masterData.team.length;

  const navItems = [
    {
      id: 'pipeline',
      label: 'CRM & Pipeline',
      description: 'Responsibility radar & stages',
      icon: Users,
      badge: `${projects.length} Deals`,
    },
    {
      id: 'workspace',
      label: 'Project Workspace',
      description: 'Requirements, zoning & briefs',
      icon: FileText,
      badge: activeProject?.engagementType ? activeProject.engagementType.split(' ')[0] : undefined,
    },
    {
      id: 'ai-studio',
      label: 'AI Concept Studio',
      description: '4-5 generative design options',
      icon: Sparkles,
      badge: activeProject?.conceptOptions.length ? `${activeProject.conceptOptions.length} Opts` : undefined,
    },
    {
      id: 'boq',
      label: 'BOQ & Commercials',
      description: 'Itemized rates & revisions',
      icon: Calculator,
      badge: activeProject?.boqRevisions.length ? `Rev ${activeProject.activeBOQRevisionNumber}` : undefined,
    },
    {
      id: 'execution',
      label: 'Site Execution',
      description: 'Milestones & punchlist snags',
      icon: HardHat,
      badge: activeProject?.snagItems.filter((s) => s.status !== 'Verified & Closed').length
        ? `${activeProject?.snagItems.filter((s) => s.status !== 'Verified & Closed').length} Snags`
        : 'On Track',
    },
    {
      id: 'billing',
      label: 'Billing & Warranty',
      description: 'Milestones, payments & claims',
      icon: Receipt,
      badge: activeProject?.invoices.length ? `${activeProject.invoices.length} Invs` : undefined,
    },
    {
      id: 'analytics',
      label: 'Data Science & ML',
      description: 'Predictive win & Monte Carlo risk',
      icon: BrainCircuit,
      badge: 'Scenario models',
    },
    {
      id: 'masters',
      label: 'Master Data Hub',
      description: 'Trades, materials, spaces & vendors',
      icon: Database,
      badge: `${totalMastersCount} Records`,
      highlight: true,
    },
  ];

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    setIsMobileOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      {/* Main Sidebar Container */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 bg-white border-r border-slate-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:h-screen lg:shrink-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-100 flex items-center justify-between shrink-0">
          <div
            className="flex items-center space-x-3 cursor-pointer"
            onClick={() => handleTabClick('pipeline')}
          >
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-xs">
              <Compass className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-base font-bold tracking-tight text-slate-900 font-['Outfit']">
                  Build Storys
                </span>
                <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded bg-slate-100 text-slate-700 font-mono">
                  v1.2
                </span>
              </div>
              <span className="block text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                Architecture &amp; Turnkey
              </span>
            </div>
          </div>

          <button
            type="button"
            className="lg:hidden p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            onClick={() => setIsMobileOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Primary Action Button */}
        <div className="p-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              onOpenNewEnquiry();
              setIsMobileOpen(false);
            }}
            className="w-full py-2.5 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-amber-400" />
            <span>+ New Customer Enquiry</span>
          </button>
        </div>

        {/* Nav Items List */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 px-2 py-1">
            Modules &amp; Workflows
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            const permission = getModulePermission(item.id as AppModuleId);
            const isRestricted = permission === 'none';
            const isReadOnly = permission === 'view_only';

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all group ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : isRestricted
                    ? 'text-slate-400 hover:bg-slate-100 hover:text-slate-600 opacity-80'
                    : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center space-x-3 min-w-0 pr-2">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isActive
                        ? 'bg-white/15 text-amber-400'
                        : isRestricted
                        ? 'bg-slate-100 text-slate-400'
                        : item.highlight
                        ? 'bg-indigo-50 text-indigo-700 group-hover:bg-indigo-100'
                        : 'bg-slate-100 text-slate-600 group-hover:bg-slate-200'
                    }`}
                  >
                    {isRestricted ? (
                      <Lock className="w-4 h-4 text-slate-400" />
                    ) : (
                      <Icon className="w-4 h-4" />
                    )}
                  </div>
                  <div className="truncate">
                    <div className="text-xs font-bold truncate leading-tight flex items-center space-x-1.5">
                      <span>{item.label}</span>
                      {isReadOnly && !isActive && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-amber-100 text-amber-800 font-semibold font-mono">
                          Read-Only
                        </span>
                      )}
                      {isRestricted && (
                        <span className="text-[9px] px-1 py-0.2 rounded bg-rose-50 text-rose-600 font-semibold font-mono">
                          Locked
                        </span>
                      )}
                    </div>
                    <div
                      className={`text-[10px] truncate leading-tight mt-0.5 ${
                        isActive ? 'text-slate-300' : isRestricted ? 'text-slate-400' : 'text-slate-400'
                      }`}
                    >
                      {isRestricted ? 'Access restricted by permission set' : item.description}
                    </div>
                  </div>
                </div>

                {item.badge && !isRestricted && (
                  <span
                    className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md shrink-0 ${
                      isActive
                        ? 'bg-amber-400 text-slate-950'
                        : item.highlight
                        ? 'bg-indigo-100 text-indigo-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom System & Persistence Hub */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/70 space-y-2 shrink-0">
          {/* Quick Permission Status Bar */}
          <button
            type="button"
            onClick={() => onOpenProfileModal('permissions')}
            className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl bg-indigo-50/80 hover:bg-indigo-100/70 border border-indigo-200/80 text-[11px] text-indigo-950 transition-colors cursor-pointer"
            title="Manage Module Permission Set"
          >
            <div className="flex items-center space-x-1.5 font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-700" />
              <span>Permission Set</span>
            </div>
            <span className="font-mono text-[9px] font-bold bg-white text-indigo-800 px-1.5 py-0.5 rounded border border-indigo-200">
              Configure &rarr;
            </span>
          </button>

          <div className="flex items-center justify-between text-xs px-1">
            <div className="flex items-center space-x-1.5 text-[11px] text-emerald-700 font-medium">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Design workspace</span>
            </div>

            <div className="flex items-center space-x-1">
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Reset all CRM and Master data back to showcase default?')) {
                    resetToDefaultSeed();
                  }
                }}
                title="Reset showcase seed"
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>

              <button
                type="button"
                onClick={onOpenBackupModal}
                title="Backup / JSON Export"
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-200/60"
              >
                <Database className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Authenticated Profile Card */}
          <div className="bg-white p-2.5 rounded-xl border border-slate-200 flex items-center justify-between text-[11px] shadow-2xs group">
            <div
              className="flex items-center space-x-2.5 min-w-0 pr-1.5 cursor-pointer flex-1"
              onClick={() => onOpenProfileModal('details')}
              title="View & Edit Profile"
            >
              <div className="w-7 h-7 rounded-lg bg-amber-400 text-slate-950 flex items-center justify-center font-bold text-xs font-mono shrink-0 shadow-2xs">
                {(user?.fullName || 'Elena Rostova')
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .slice(0, 2)
                  .toUpperCase()}
              </div>
              <div className="truncate">
                <span className="font-bold text-slate-900 block truncate group-hover:text-amber-700 transition-colors">
                  {user?.fullName || 'Elena Rostova'}
                </span>
                <span className="text-[10px] text-slate-400 block truncate">
                  {user?.role || 'Design Principal'}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-0.5 shrink-0">
              <button
                type="button"
                onClick={() => onOpenProfileModal('details')}
                title="View & Edit Profile"
                className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
              >
                <User className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (window.confirm('Log out from your studio workspace?')) {
                    logout();
                  }
                }}
                title="Log Out Immediately"
                className="p-1 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
