import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ProjectProvider, useProject } from './context/ProjectContext';
import { Sidebar } from './components/Sidebar';
import { TopBar } from './components/TopBar';


import { CustomerPipelineView } from './components/CustomerPipelineView';
import { ProjectWorkspaceView } from './components/ProjectWorkspaceView';
import { AIDesignStudioView } from './components/AIDesignStudioView';
import { BOQCommercialsView } from './components/BOQCommercialsView';
import { SiteExecutionView } from './components/SiteExecutionView';
import { BillingWarrantyView } from './components/BillingWarrantyView';
import { DataScienceAnalyticsView } from './components/DataScienceAnalyticsView';
import { MasterDataView } from './components/MasterDataView';
import { NewEnquiryModal } from './components/NewEnquiryModal';
import { DataBackupModal } from './components/DataBackupModal';
import {
  Compass,
  CheckCircle2,
  Lock,
  Eye,
  ShieldAlert,
  SlidersHorizontal,
  ArrowRight,
  ArrowLeft,
} from 'lucide-react';
import { AppModuleId } from './types';

function mapInitialTab(tab?: string): string {
  if (!tab) return 'pipeline';
  if (tab === 'arch_studio' || tab === 'ai-studio') return 'ai-studio';
  if (tab === 'data_science' || tab === 'analytics') return 'analytics';
  if (tab === 'arch_workspace' || tab === 'workspace') return 'workspace';
  if (tab === 'arch_pipeline' || tab === 'pipeline') return 'pipeline';
  if (['pipeline', 'workspace', 'ai-studio', 'boq', 'execution', 'billing', 'analytics', 'masters'].includes(tab)) {
    return tab;
  }
  return 'pipeline';
}

function AppContent({
  onOpenProfile,
  initialTab,
  onNavigateBackToERP,
}: {
  onOpenProfile: () => void;
  initialTab?: string;
  onNavigateBackToERP?: (targetTab?: string) => void;
}) {
  const [activeTab, setActiveTab] = useState<string>(() => mapInitialTab(initialTab));
  const [isMobileNavOpen, setIsMobileNavOpen] = useState<boolean>(false);
  const [isNewEnquiryOpen, setIsNewEnquiryOpen] = useState<boolean>(false);
  const [isBackupModalOpen, setIsBackupModalOpen] = useState<boolean>(() => initialTab === 'data_backup' || initialTab === 'backup');
  const [isProfileModalOpen, setIsProfileModalOpen] = useState<boolean>(false);
  const [profileModalTab, setProfileModalTab] = useState<'details' | 'security' | 'permissions'>('details');

  React.useEffect(() => {
    if (initialTab) {
      if (initialTab === 'data_backup' || initialTab === 'backup') {
        setIsBackupModalOpen(true);
      } else {
        setActiveTab(mapInitialTab(initialTab));
      }
    }
  }, [initialTab]);

  const { setActiveProjectId, activeProject, isSynced } = useProject();
  const [handoffMessage, setHandoffMessage] = useState('');
  const [handingOff, setHandingOff] = useState(false);
  const { getModulePermission, user } = useAuth();

  const currentPermission = getModulePermission(activeTab as AppModuleId);

  const handleSelectProjectTab = (tab: string, projectId: string) => {
    setActiveProjectId(projectId);
    setActiveTab(tab);
  };

  const handleEnquiryCreated = (newProjectId: string) => {
    setActiveProjectId(newProjectId);
    setActiveTab('workspace');
  };

  const handleOpenProfile = (tab: 'details' | 'security' | 'permissions' = 'details') => {
    onOpenProfile();
  };

  return (
    <div className="arch-workspace h-screen w-full bg-slate-50 flex flex-row font-sans text-slate-900 antialiased selection:bg-slate-900 selection:text-white overflow-hidden">
        {/* Left Sidebar Menu */}
        <Sidebar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenNewEnquiry={() => setIsNewEnquiryOpen(true)}
          onOpenBackupModal={() => setIsBackupModalOpen(true)}
          onOpenProfileModal={handleOpenProfile}
          isMobileOpen={isMobileNavOpen}
          setIsMobileOpen={setIsMobileNavOpen}
          onExitToERP={onNavigateBackToERP ? () => onNavigateBackToERP('dashboard') : undefined}
        />

        {/* Main Content Column: Frozen Header + Scrollable Content Viewport */}
        <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
          {/* Frozen Top Bar Header (Stays Fixed at Top during Page Scroll) */}
          <TopBar
            activeTab={activeTab}
            onOpenMobileMenu={() => setIsMobileNavOpen(true)}
            onOpenNewEnquiry={() => setIsNewEnquiryOpen(true)}
            onOpenBackupModal={() => setIsBackupModalOpen(true)}
            onOpenProfileModal={handleOpenProfile}
            onExitToERP={onNavigateBackToERP ? () => onNavigateBackToERP('dashboard') : undefined}
          />

          {/* Scrollable Viewport */}
          <div id="main-scroll-viewport" className="flex-1 overflow-y-auto overflow-x-hidden w-full flex flex-col">
            <div className="px-4 py-2 bg-white border-b flex flex-wrap items-center gap-3 text-xs">
              {onNavigateBackToERP && (
                <button
                  type="button"
                  onClick={() => onNavigateBackToERP('dashboard')}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#002050] text-white font-semibold hover:bg-[#0c5999] transition shadow-2xs cursor-pointer"
                  title="Return to Enact360 Role Center Dashboard"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Return to Enact360 ERP</span>
                </button>
              )}
              <span className="font-semibold mr-auto">{activeProject?.enquiryNumber} · {activeProject?.clientName || 'Select a customer project'}</span>
              <button disabled={!activeProject || handingOff || !isSynced} className="px-3 py-2 rounded-lg bg-slate-100 font-semibold disabled:opacity-40 hover:bg-slate-200 transition cursor-pointer" onClick={async()=>{
                setHandingOff(true);setHandoffMessage('');
                try {const r=await fetch('/api/architecture/projects/'+encodeURIComponent(activeProject!.id)+'/handoff',{method:'POST'});const d=await r.json();if(!r.ok)throw new Error(d.error);setHandoffMessage((d.existing?'Existing job: ':'Created job: ')+d.project.projectCode+'. Open ERP & Operations to continue.');}
                catch(e:any){setHandoffMessage(e.message || 'Handoff failed. Please retry.');}finally{setHandingOff(false);}
              }}>{handingOff?'Creating job…':'Create / locate ERP job'}</button>
            {handoffMessage && <span role="status" className="w-full text-slate-700">{handoffMessage}</span>}
          </div>
          {/* Read-Only Mode Notification Banner */}
          {currentPermission === 'view_only' && (
            <div className="bg-amber-50 border-b border-amber-200 px-4 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between text-xs text-amber-900 shrink-0">
              <div className="flex items-center space-x-2">
                <Eye className="w-4 h-4 text-amber-600 shrink-0" />
                <span className="font-medium">
                  <strong>Read-Only Access:</strong> You are currently viewing this module in observation mode. Records and status cannot be modified under your assigned permission set.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleOpenProfile('permissions')}
                className="hidden sm:inline-flex items-center space-x-1 font-bold text-amber-950 underline hover:text-amber-800 ml-4 shrink-0 cursor-pointer"
              >
                <span>Edit Permissions</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>
          )}

          {/* Primary Screen View Container */}
          <main className="flex-1 w-full px-4 sm:px-6 lg:px-8 py-6">
            {/* If module access is restricted */}
            {currentPermission === 'none' ? (
              <div className="max-w-2xl mx-auto my-12 p-8 bg-white border border-rose-200 rounded-2xl shadow-xs text-center">
                <div className="w-14 h-14 mx-auto rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 mb-4 shadow-2xs">
                  <Lock className="w-7 h-7" />
                </div>
                <h2 className="text-xl font-bold text-slate-900 mb-2">
                  Module Access Restricted
                </h2>
                <p className="text-sm text-slate-600 mb-6 leading-relaxed max-w-lg mx-auto">
                  Your current account (<strong>{user?.fullName}</strong> — {user?.role}) does not have permission to view or interact with this CRM module under the active security policy.
                </p>

                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl mb-6 text-xs text-slate-600 text-left space-y-1">
                  <div className="font-bold text-slate-800 flex items-center space-x-1.5">
                    <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
                    <span>Role-Based Access Control (RBAC) Details</span>
                  </div>
                  <p className="text-slate-500">
                    Permissions can be modified via the User Profile &gt; Module Permissions matrix.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => setActiveTab('pipeline')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                  >
                    Return to Customer Pipeline
                  </button>
                  <button
                    type="button"
                    onClick={() => handleOpenProfile('permissions')}
                    className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center space-x-1.5 shadow-xs transition-colors cursor-pointer"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-400" />
                    <span>Configure Permission Set</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {activeTab === 'pipeline' && (
                  <CustomerPipelineView
                    onSelectProjectTab={handleSelectProjectTab}
                    onOpenNewEnquiry={() => setIsNewEnquiryOpen(true)}
                  />
                )}

                {activeTab === 'workspace' && (
                  <ProjectWorkspaceView onNavigateTab={(tab) => setActiveTab(tab)} />
                )}

                {activeTab === 'ai-studio' && (
                  <AIDesignStudioView onNavigateTab={(tab) => setActiveTab(tab)} />
                )}

                {activeTab === 'boq' && (
                  <BOQCommercialsView onNavigateTab={(tab) => setActiveTab(tab)} />
                )}

                {activeTab === 'execution' && <SiteExecutionView />}

                {activeTab === 'billing' && <BillingWarrantyView />}

                {activeTab === 'analytics' && (
                  <DataScienceAnalyticsView onNavigateTab={handleSelectProjectTab} />
                )}

                {activeTab === 'masters' && <MasterDataView />}
              </>
            )}
          </main>

          {/* Minimalist Studio Footer */}
          <footer className="border-t border-slate-200 bg-white py-3.5 mt-auto shrink-0">
            <div className="w-full px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
              <div className="flex items-center space-x-2">
                <Compass className="w-4 h-4 text-slate-700" />
                <span className="font-semibold text-slate-800">Build Storys Design & CRM</span>
                <span>•</span>
                <span>One customer history, controlled approvals, traceable commercial revisions &amp; enterprise masters</span>
              </div>

              <div className="flex items-center space-x-4 text-[11px]">
                <span className="flex items-center space-x-1 text-emerald-700 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Design & delivery workspace</span>
                </span>
                <span>•</span>
                <span className="text-slate-400">8 Supported Engagement Routes</span>
              </div>
            </div>
          </footer>
        </div>
      </div>

      {/* Modals */}
      <NewEnquiryModal
        isOpen={isNewEnquiryOpen}
        onClose={() => setIsNewEnquiryOpen(false)}
        onSuccess={handleEnquiryCreated}
      />

      <DataBackupModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
      />


    </div>
  );
}

export default function ArchitectureWorkspace({
  currentUser,
  onLogout,
  onOpenProfile,
  initialTab,
  onNavigateBackToERP,
}: {
  currentUser: import('../types/erp').UserSession;
  onLogout: () => void;
  onOpenProfile: () => void;
  initialTab?: string;
  onNavigateBackToERP?: (targetTab?: string) => void;
}) {
  return (
    <AuthProvider currentUser={currentUser} onLogout={onLogout}>
      <ProjectProvider>
        <AppContent
          onOpenProfile={onOpenProfile}
          initialTab={initialTab}
          onNavigateBackToERP={onNavigateBackToERP}
        />
      </ProjectProvider>
    </AuthProvider>
  );
}
