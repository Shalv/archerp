import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Database,
  RotateCcw,
  CheckCircle2,
  ChevronDown,
  Building2,
  HardHat,
  FileText,
  SlidersHorizontal,
} from 'lucide-react';
import { useProject } from '../context/ProjectContext';

interface HeaderProps {
  onOpenNewEnquiry: () => void;
  onOpenBackupModal: () => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNewEnquiry,
  onOpenBackupModal,
  activeTab,
  setActiveTab,
}) => {
  const {
    projects,
    activeProjectId,
    activeProject,
    setActiveProjectId,
    resetToDefaultSeed,
    lastSavedTimestamp,
  } = useProject();

  const [isProjectDropdownOpen, setIsProjectDropdownOpen] = useState(false);

  const tabs = [
    { id: 'pipeline', label: 'CRM & Pipeline' },
    { id: 'workspace', label: 'Project Brief' },
    { id: 'ai-studio', label: 'AI Concept Studio', badge: activeProject?.conceptOptions.length ? `${activeProject.conceptOptions.length} Options` : undefined },
    { id: 'boq', label: 'BOQ & Commercials', badge: activeProject?.boqRevisions.length ? `Rev ${activeProject.activeBOQRevisionNumber}` : undefined },
    { id: 'execution', label: 'Execution & Snagging' },
    { id: 'billing', label: 'Billing & Warranty' },
  ];

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Top Utility Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('pipeline')}>
              <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center shadow-sm">
                <Compass className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <span className="text-lg font-bold tracking-tight text-slate-900 font-['Outfit']">ArchCRM</span>
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">Architecture & Turnkey CRM</span>
              </div>
            </div>

            {/* Active Project Selector */}
            <div className="relative hidden md:block">
              <button
                type="button"
                onClick={() => setIsProjectDropdownOpen(!isProjectDropdownOpen)}
                className="flex items-center space-x-2.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100/80 transition-colors text-left text-xs"
              >
                <Building2 className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                <div className="truncate max-w-[200px]">
                  <span className="font-semibold text-slate-900 block truncate">
                    {activeProject?.clientName || 'Select Project'}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate">
                    {activeProject?.engagementType}
                  </span>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              </button>

              {isProjectDropdownOpen && (
                <div className="absolute left-0 mt-1.5 w-72 rounded-xl bg-white border border-slate-200 shadow-xl py-1.5 z-50">
                  <div className="px-3 py-1.5 border-b border-slate-100 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Switch Active Project
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {projects.map((p) => (
                      <button
                        key={p.id}
                        type="button"
                        onClick={() => {
                          setActiveProjectId(p.id);
                          setIsProjectDropdownOpen(false);
                        }}
                        className={`w-full text-left px-3 py-2 text-xs flex items-start justify-between hover:bg-slate-50 transition-colors ${
                          p.id === activeProjectId ? 'bg-slate-50/80 font-medium' : ''
                        }`}
                      >
                        <div className="truncate pr-2">
                          <p className="text-slate-900 font-semibold truncate">{p.clientName}</p>
                          <p className="text-[11px] text-slate-500 truncate">{p.organizationOrFamily} • {p.siteCity}</p>
                        </div>
                        <span className="shrink-0 text-[10px] px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono">
                          {p.enquiryNumber}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            {/* Local storage sync badge */}
            <div className="hidden lg:flex items-center space-x-1.5 text-[11px] text-slate-500 px-2.5 py-1 bg-slate-50 rounded-md border border-slate-200">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Local Storage Saved</span>
            </div>

            {/* Demo Reset */}
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Reset all CRM data back to the demo showcase projects?')) {
                  resetToDefaultSeed();
                }
              }}
              title="Reset to default showcase seed data"
              className="p-2 rounded-lg text-slate-500 hover:text-slate-700 hover:bg-slate-100 border border-transparent transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Backup / Export JSON */}
            <button
              type="button"
              onClick={onOpenBackupModal}
              title="Export or Import JSON Backup"
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200/80 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-slate-600" />
              <span className="hidden sm:inline">Backup / JSON</span>
            </button>

            {/* New Enquiry Button */}
            <button
              type="button"
              onClick={onOpenNewEnquiry}
              className="flex items-center space-x-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 transition-colors shadow-xs"
            >
              <Plus className="w-4 h-4 text-amber-400" />
              <span>New Customer Enquiry</span>
            </button>
          </div>
        </div>

        {/* Bottom Tab Navigation */}
        <div className="flex space-x-1 overflow-x-auto scrollbar-none border-t border-slate-100 pt-1 pb-1">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-1.5 px-3.5 py-2 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                      isActive ? 'bg-amber-400 text-slate-950 font-bold' : 'bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
